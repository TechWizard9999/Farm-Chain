const Auction = require("../models/auction");
const Bid = require("../models/bid");
const {
  canTransition,
  getNextState,
} = require("../stateMachines/auctionStateMachine");
const Order = require("../models/order");
const productService = require("./productService");

class AuctionService {
  async findById(id) {
    return Auction.findById(id)
      .populate("farmer")
      .populate("product")
      .populate("highestBidder");
  }

  async findByFarmer(farmerId) {
    return Auction.find({ farmer: farmerId })
      .populate("product")
      .populate("highestBidder")
      .sort({ createdAt: -1 });
  }

  async findOpen() {
    // Only return auctions that are open AND deadline has not passed
    return Auction.find({ 
      status: "open",
      deadline: { $gt: new Date() }  // deadline must be in the future
    })
      .populate("farmer")
      .populate("product")
      .sort({ deadline: 1 });
  }

  async create(auctionData) {
    const auction = new Auction(auctionData);
    return await auction.save();
  }

  async placeBid(auctionId, bidderId, pricePerKg, bidderType = 'business') {
    const auction = await Auction.findById(auctionId);
    if (!auction) throw new Error("Auction not found");
    if (auction.status !== "open") throw new Error("Auction is not open");
    if (new Date() > auction.deadline) throw new Error("Auction has expired");
    if (pricePerKg <= auction.highestBid)
      throw new Error(`Bid must be higher than ${auction.highestBid}`);

    const bidData = {
      auction: auctionId,
      pricePerKg,
      quantity: auction.quantity,
      bidAmount: pricePerKg * auction.quantity,
    };

    // Support both business and user bids
    if (bidderType === 'user') {
      bidData.user = bidderId;
    } else {
      bidData.business = bidderId;
    }

    const bid = new Bid(bidData);
    await bid.save();

    auction.highestBid = pricePerKg;
    auction.highestBidder = bidderId;
    auction.highestBidderType = bidderType === 'user' ? 'User' : 'Business';
    await auction.save();

    return this.findById(auctionId);
  }

  async closeAuction(auctionId, farmerId) {
    const auction = await Auction.findById(auctionId);
    if (!auction) throw new Error("Auction not found");
    if (auction.farmer.toString() !== farmerId)
      throw new Error("Not authorized");
    if (!canTransition(auction.status, "CLOSE"))
      throw new Error("Cannot close auction");

    auction.status = getNextState(auction.status, "CLOSE");
    await auction.save();
    return this.findById(auctionId);
  }

  async awardAuction(auctionId, farmerId) {
    const auction = await Auction.findById(auctionId);
    if (!auction) throw new Error("Auction not found");
    if (auction.farmer.toString() !== farmerId)
      throw new Error("Not authorized");
    if (!auction.highestBidder) throw new Error("No bids to award");
    if (!canTransition(auction.status, "AWARD"))
      throw new Error("Cannot award - close auction first");

    auction.status = getNextState(auction.status, "AWARD");
    await auction.save();

    const order = new Order({
      type: "from_bid",
      business: auction.highestBidder,
      farmer: auction.farmer,
      product: auction.product,
      quantity: auction.quantity,
      pricePerKg: auction.highestBid,
      totalAmount: auction.quantity * auction.highestBid,
      status: "pending",
    });
    await order.save();

    await productService.reduceQty(auction.product, auction.quantity);

    return this.findById(auctionId);
  }

  async getBidsForAuction(auctionId) {
    return Bid.find({ auction: auctionId })
      .populate("business")
      .sort({ createdAt: -1 });
  }

  async findBidsByBidder(bidderId) {
    // Find all bids by this bidder (either as business or user)
    return Bid.find({
      $or: [
        { business: bidderId },
        { user: bidderId }
      ]
    })
      .populate({
        path: "auction",
        populate: {
          path: "product"
        }
      })
      .sort({ createdAt: -1 });
  }
}

module.exports = new AuctionService();
