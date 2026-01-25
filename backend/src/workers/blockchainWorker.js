/**
 * Blockchain Worker Service
 * 
 * This worker processes blockchain transactions asynchronously using Bull Queue with Redis.
 * It handles transaction queuing, retry logic, and ensures reliable blockchain operations.
 * 
 * Features:
 * - Async job processing for blockchain transactions
 * - Automatic retry with exponential backoff
 * - Job prioritization for critical transactions
 * - Rate limiting to prevent network congestion
 * - Dead letter queue for failed transactions
 * - Real-time job status tracking
 */

const Queue = require('bull');
const Redis = require('ioredis');

// Redis Configuration
const REDIS_CONFIG = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
};

// Queue Configuration
const QUEUE_CONFIG = {
    defaultJobOptions: {
        attempts: 5,
        backoff: {
            type: 'exponential',
            delay: 2000
        },
        removeOnComplete: 100,
        removeOnFail: 50
    },
    limiter: {
        max: 10,
        duration: 1000
    }
};

// Job Types
const JOB_TYPES = {
    LOG_ACTIVITY: 'log_activity',
    VERIFY_BATCH: 'verify_batch',
    UPDATE_JOURNEY: 'update_journey',
    MINT_CERTIFICATE: 'mint_certificate',
    TRANSFER_OWNERSHIP: 'transfer_ownership'
};

// Priority Levels
const PRIORITY = {
    CRITICAL: 1,
    HIGH: 2,
    NORMAL: 3,
    LOW: 4
};

/**
 * BlockchainWorker Class
 * Manages blockchain transaction queue and processing
 */
class BlockchainWorker {
    constructor() {
        this.redis = null;
        this.queue = null;
        this.isRunning = false;
        this.metrics = {
            processed: 0,
            failed: 0,
            pending: 0
        };
    }

    /**
     * Initialize the worker with Redis connection and Bull queue
     */
    async initialize() {
        try {
            // Create Redis connection
            this.redis = new Redis(REDIS_CONFIG);

            this.redis.on('connect', () => {
                console.log('✅ Redis connected for blockchain worker');
            });

            this.redis.on('error', (err) => {
                console.error('❌ Redis connection error:', err.message);
            });

            // Create Bull queue for blockchain transactions
            this.queue = new Queue('blockchain-transactions', {
                redis: REDIS_CONFIG,
                ...QUEUE_CONFIG
            });

            // Register job processors
            this._registerProcessors();

            // Register event handlers
            this._registerEventHandlers();

            this.isRunning = true;
            console.log('🚀 Blockchain Worker initialized successfully');

            return true;
        } catch (error) {
            console.error('Failed to initialize blockchain worker:', error);
            throw error;
        }
    }

    /**
     * Register job processors for different transaction types
     */
    _registerProcessors() {
        // Main processor with concurrency
        this.queue.process(5, async (job) => {
            const { type, data } = job.data;

            console.log(`📦 Processing job ${job.id} - Type: ${type}`);

            switch (type) {
                case JOB_TYPES.LOG_ACTIVITY:
                    return await this._processActivityLog(job, data);

                case JOB_TYPES.VERIFY_BATCH:
                    return await this._processBatchVerification(job, data);

                case JOB_TYPES.UPDATE_JOURNEY:
                    return await this._processJourneyUpdate(job, data);

                case JOB_TYPES.MINT_CERTIFICATE:
                    return await this._processCertificateMint(job, data);

                case JOB_TYPES.TRANSFER_OWNERSHIP:
                    return await this._processOwnershipTransfer(job, data);

                default:
                    throw new Error(`Unknown job type: ${type}`);
            }
        });
    }

    /**
     * Register event handlers for queue monitoring
     */
    _registerEventHandlers() {
        this.queue.on('completed', (job, result) => {
            this.metrics.processed++;
            console.log(`✅ Job ${job.id} completed:`, result?.transactionHash || 'Success');
        });

        this.queue.on('failed', (job, error) => {
            this.metrics.failed++;
            console.error(`❌ Job ${job.id} failed:`, error.message);
        });

        this.queue.on('stalled', (job) => {
            console.warn(`⚠️ Job ${job.id} stalled - will be reprocessed`);
        });

        this.queue.on('progress', (job, progress) => {
            console.log(`📊 Job ${job.id} progress: ${progress}%`);
        });

        this.queue.on('waiting', (jobId) => {
            this.metrics.pending++;
        });
    }

    /**
     * Add a new blockchain transaction to the queue
     */
    async addTransaction(type, data, options = {}) {
        const jobOptions = {
            priority: options.priority || PRIORITY.NORMAL,
            delay: options.delay || 0,
            attempts: options.attempts || 5,
            ...options
        };

        const job = await this.queue.add(
            { type, data, timestamp: Date.now() },
            jobOptions
        );

        console.log(`📥 Transaction queued - Job ID: ${job.id}, Type: ${type}`);

        return {
            jobId: job.id,
            type,
            status: 'queued'
        };
    }

    /**
     * Process activity log transaction
     */
    async _processActivityLog(job, data) {
        job.progress(10);

        const { batchId, action, actor, metadata } = data;

        // Simulate blockchain transaction preparation
        const txData = {
            batchId,
            action,
            actor,
            timestamp: Date.now(),
            metadata: JSON.stringify(metadata)
        };

        job.progress(30);

        // Simulate gas estimation
        const estimatedGas = this._estimateGas('logActivity', txData);

        job.progress(50);

        // Simulate transaction execution
        const txResult = await this._simulateTransaction('logActivity', txData, estimatedGas);

        job.progress(100);

        return {
            success: true,
            transactionHash: txResult.hash,
            blockNumber: txResult.blockNumber,
            gasUsed: txResult.gasUsed
        };
    }

    /**
     * Process batch verification transaction
     */
    async _processBatchVerification(job, data) {
        job.progress(10);

        const { batchId, verificationData, certifications } = data;

        const txData = {
            batchId,
            verificationHash: this._generateHash(verificationData),
            certifications,
            verifiedAt: Date.now()
        };

        job.progress(40);

        const estimatedGas = this._estimateGas('verifyBatch', txData);
        const txResult = await this._simulateTransaction('verifyBatch', txData, estimatedGas);

        job.progress(100);

        return {
            success: true,
            transactionHash: txResult.hash,
            verified: true,
            batchId
        };
    }

    /**
     * Process journey update transaction
     */
    async _processJourneyUpdate(job, data) {
        job.progress(10);

        const { batchId, stage, location, handler, notes } = data;

        const txData = {
            batchId,
            stage,
            location: JSON.stringify(location),
            handler,
            notes,
            timestamp: Date.now()
        };

        job.progress(50);

        const estimatedGas = this._estimateGas('updateJourney', txData);
        const txResult = await this._simulateTransaction('updateJourney', txData, estimatedGas);

        job.progress(100);

        return {
            success: true,
            transactionHash: txResult.hash,
            stage,
            batchId
        };
    }

    /**
     * Process certificate minting transaction
     */
    async _processCertificateMint(job, data) {
        job.progress(10);

        const { batchId, certificateType, issuedTo, validUntil } = data;

        const txData = {
            batchId,
            certificateType,
            issuedTo,
            validUntil,
            issuedAt: Date.now(),
            tokenURI: `ipfs://farmchain/certificates/${batchId}`
        };

        job.progress(40);

        const estimatedGas = this._estimateGas('mintCertificate', txData);
        const txResult = await this._simulateTransaction('mintCertificate', txData, estimatedGas);

        job.progress(100);

        return {
            success: true,
            transactionHash: txResult.hash,
            tokenId: txResult.tokenId,
            certificateType
        };
    }

    /**
     * Process ownership transfer transaction
     */
    async _processOwnershipTransfer(job, data) {
        job.progress(10);

        const { batchId, fromAddress, toAddress, quantity } = data;

        const txData = {
            batchId,
            from: fromAddress,
            to: toAddress,
            quantity,
            transferredAt: Date.now()
        };

        job.progress(50);

        const estimatedGas = this._estimateGas('transferOwnership', txData);
        const txResult = await this._simulateTransaction('transferOwnership', txData, estimatedGas);

        job.progress(100);

        return {
            success: true,
            transactionHash: txResult.hash,
            newOwner: toAddress
        };
    }

    /**
     * Simulate gas estimation (placeholder for actual blockchain call)
     */
    _estimateGas(method, data) {
        const baseGas = {
            logActivity: 50000,
            verifyBatch: 80000,
            updateJourney: 60000,
            mintCertificate: 150000,
            transferOwnership: 45000
        };

        return baseGas[method] || 100000;
    }

    /**
     * Simulate blockchain transaction (placeholder for actual blockchain call)
     */
    async _simulateTransaction(method, data, gasLimit) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 100));

        // Generate mock transaction result
        return {
            hash: `0x${this._generateRandomHex(64)}`,
            blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
            gasUsed: Math.floor(gasLimit * 0.8),
            tokenId: method === 'mintCertificate' ? Math.floor(Math.random() * 10000) : undefined
        };
    }

    /**
     * Generate a hash from data
     */
    _generateHash(data) {
        const str = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return `0x${Math.abs(hash).toString(16).padStart(64, '0')}`;
    }

    /**
     * Generate random hex string
     */
    _generateRandomHex(length) {
        const chars = '0123456789abcdef';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }

    /**
     * Get job status by ID
     */
    async getJobStatus(jobId) {
        const job = await this.queue.getJob(jobId);

        if (!job) {
            return { error: 'Job not found' };
        }

        const state = await job.getState();

        return {
            jobId: job.id,
            type: job.data.type,
            state,
            progress: job.progress(),
            attempts: job.attemptsMade,
            data: job.data,
            result: job.returnvalue,
            failedReason: job.failedReason
        };
    }

    /**
     * Get queue statistics
     */
    async getQueueStats() {
        const [waiting, active, completed, failed, delayed] = await Promise.all([
            this.queue.getWaitingCount(),
            this.queue.getActiveCount(),
            this.queue.getCompletedCount(),
            this.queue.getFailedCount(),
            this.queue.getDelayedCount()
        ]);

        return {
            waiting,
            active,
            completed,
            failed,
            delayed,
            metrics: this.metrics
        };
    }

    /**
     * Retry failed jobs
     */
    async retryFailedJobs() {
        const failedJobs = await this.queue.getFailed();

        for (const job of failedJobs) {
            await job.retry();
        }

        return { retriedCount: failedJobs.length };
    }

    /**
     * Clean old completed/failed jobs
     */
    async cleanOldJobs(gracePeriod = 24 * 60 * 60 * 1000) {
        await this.queue.clean(gracePeriod, 'completed');
        await this.queue.clean(gracePeriod, 'failed');

        return { cleaned: true };
    }

    /**
     * Pause the queue
     */
    async pause() {
        await this.queue.pause();
        this.isRunning = false;
        console.log('⏸️ Blockchain worker paused');
    }

    /**
     * Resume the queue
     */
    async resume() {
        await this.queue.resume();
        this.isRunning = true;
        console.log('▶️ Blockchain worker resumed');
    }

    /**
     * Graceful shutdown
     */
    async shutdown() {
        console.log('🛑 Shutting down blockchain worker...');

        await this.queue.close();
        await this.redis.quit();

        this.isRunning = false;
        console.log('✅ Blockchain worker shut down gracefully');
    }
}

// Export singleton instance and utilities
const blockchainWorker = new BlockchainWorker();

module.exports = {
    blockchainWorker,
    BlockchainWorker,
    JOB_TYPES,
    PRIORITY
};
