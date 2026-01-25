const Product = require("../models/product");
const Batch = require("../models/batch");
const Farm = require("../models/farm");
const User = require("../models/user");

class TraceabilityService {
    async getTraceByQR(qrCode) {
        let product = await Product.findOne({ qrCode });
        let batch = null;
        let farm = null;
        let farmer = null;

        if (product) {
            batch = await Batch.findById(product.batch);
            if (batch) {
                farm = await Farm.findById(batch.farm);
                farmer = await User.findById(product.farmer);
            }
        } else if (qrCode.match(/^[0-9a-fA-F]{24}$/)) {
            // Fallback 1: Try finding by Product ID directly
            product = await Product.findById(qrCode);
            if (product) {
                batch = await Batch.findById(product.batch);
                if (batch) {
                    farm = await Farm.findById(batch.farm);
                    farmer = await User.findById(product.farmer);
                }
            }
            
            // Fallback 2: Try finding by Batch ID directly
            if (!product) {
                batch = await Batch.findById(qrCode);
                if (batch) {
                    farm = await Farm.findById(batch.farm);
                    if (farm) {
                        farmer = await User.findById(farm.farmer);
                    }

                    // Create a virtual product wrapper for the frontend
                    product = {
                        _id: batch._id,
                        id: batch._id,
                        title: `${batch.cropName}`,
                        description: `Direct Farm Batch (${batch.variety || 'Standard'})`,
                        category: batch.cropCategory,
                        pricePerKg: 0,
                        availableQty: 0,
                        isOrganic: false, // Will be calculated
                        qrCode: qrCode,
                        status: 'active',
                        createdAt: batch.createdAt,
                        farmer: farmer ? farmer._id : null
                    };
                }
            }
        }

        if (!product || !batch) return null;

        const timeline = this.buildTimeline(batch);
        const freshnessScore = this.calculateFreshness(batch);
        const organicScore = this.calculateOrganicScore(batch);

        // Update virtual product with calculated scores
        if (!product.isOrganic && organicScore === 100) {
            product.isOrganic = true;
        }

        return {
            product,
            farmer: farmer ? { name: farmer.name, verified: true } : null,
            farm: farm ? {
                latitude: farm.location?.latitude,
                longitude: farm.location?.longitude,
                size: farm.size,
                soilType: farm.soilType,
                organicStatus: farm.organicStatus
            } : null,
            batch: {
                cropName: batch.cropName,
                variety: batch.variety,
                seedSource: batch.seedSource,
                sowingDate: batch.sowingDate,
                harvestDate: batch.harvests?.[0]?.harvestDate,
                qualityGrade: batch.harvests?.[0]?.qualityGrade
            },
            timeline,
            scores: {
                freshness: freshnessScore,
                organic: organicScore,
                overall: Math.round((freshnessScore + organicScore) / 2)
            },
            isVerified: true
        };
    }

    buildTimeline(batch) {
        const events = [];

        events.push({
            type: 'SOWING',
            date: batch.sowingDate,
            title: 'Seeds Planted',
            description: `${batch.cropName} (${batch.variety || 'N/A'}) seeds`,
            icon: '🌱'
        });

        for (const activity of batch.activities || []) {
            let icon = '📋';
            let title = activity.activityType;
            
            switch(activity.activityType) {
                case 'SEEDING': icon = '🌱'; title = 'Seeding'; break;
                case 'WATERING': icon = '💧'; title = 'Irrigation'; break;
                case 'FERTILIZER': icon = '🧪'; title = 'Fertilizer Applied'; break;
                case 'PESTICIDE': icon = '🛡️'; title = 'Pest Control'; break;
                case 'HARVEST': icon = '🌾'; title = 'Harvested'; break;
            }

            events.push({
                type: activity.activityType,
                date: activity.date,
                title,
                description: activity.productName || activity.notes || '',
                whoClass: activity.whoClass,
                icon
            });
        }

        for (const harvest of batch.harvests || []) {
            events.push({
                type: 'HARVEST',
                date: harvest.harvestDate,
                title: 'Harvested',
                description: `${harvest.totalQty} kg - Grade ${harvest.qualityGrade}`,
                icon: '🌾'
            });
        }

        return events.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    calculateFreshness(batch) {
        const harvestDate = batch.harvests?.[0]?.harvestDate;
        if (!harvestDate) return 50;
        const days = Math.floor((Date.now() - new Date(harvestDate)) / (1000 * 60 * 60 * 24));
        if (days <= 1) return 100;
        if (days <= 3) return 90;
        if (days <= 7) return 75;
        return 50;
    }

    calculateOrganicScore(batch) {
        const chemicals = (batch.activities || []).filter(a => 
            a.activityType === 'PESTICIDE' || a.activityType === 'FERTILIZER'
        );
        if (chemicals.length === 0) return 100;
        const organic = chemicals.filter(a => a.whoClass === 'U').length;
        return Math.round((organic / chemicals.length) * 100);
    }
}

module.exports = new TraceabilityService();
