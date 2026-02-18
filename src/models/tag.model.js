// Tag model - Database operations only (validation handled by Zod)
import { getDb } from "#config/db.js";
import logger from "#utils/logger.js";
import { ObjectId } from "mongodb";

const COLLECTION_NAME = "tags";

// Indexes for performance and uniqueness
export const tagIndexes = [
    { key: { slug: 1 }, unique: true, name: "slug_unique" },
    { key: { title: 1 }, name: "title_index" },
];

// Initialize collection with indexes
export const initializeTagCollection = async () => {
    const db = getDb();

    try {
        const collections = await db.listCollections({ name: COLLECTION_NAME }).toArray();

        if (collections.length === 0) {
            await db.createCollection(COLLECTION_NAME);
            logger.info(`Collection '${COLLECTION_NAME}' created`);
        }

        await db.collection(COLLECTION_NAME).createIndexes(tagIndexes);
        logger.info(`Indexes created for '${COLLECTION_NAME}'`);
    } catch (error) {
        logger.error(`Error initializing collection '${COLLECTION_NAME}'`, {
            error: error.message,
            stack: error.stack,
        });
        throw error;
    }
};

// Database operations
export const createTag = async (tagData) => {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).insertOne(tagData);
    return result;
};

export const findTagById = async (tagId) => {
    const db = getDb();
    const objectId = ObjectId.isValid(tagId) ? new ObjectId(tagId) : tagId;
    return await db.collection(COLLECTION_NAME).findOne({ _id: objectId });
};

export const findTagBySlug = async (slug) => {
    const db = getDb();
    return await db.collection(COLLECTION_NAME).findOne({ slug });
};

export const findAllTags = async (filter = {}, options = {}) => {
    const db = getDb();
    const { skip = 0, limit = 50, sort = { title: 1 } } = options;

    return await db
        .collection(COLLECTION_NAME)
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray();
};

export const findTagsByIds = async (tagIds) => {
    const db = getDb();
    const objectIds = tagIds.map((id) => (ObjectId.isValid(id) ? new ObjectId(id) : id));

    return await db
        .collection(COLLECTION_NAME)
        .find({ _id: { $in: objectIds } })
        .toArray();
};

export const updateTagById = async (tagId, updateData) => {
    const db = getDb();
    const objectId = ObjectId.isValid(tagId) ? new ObjectId(tagId) : tagId;
    const result = await db
        .collection(COLLECTION_NAME)
        .updateOne({ _id: objectId }, { $set: updateData });
    return result;
};

export const deleteTagById = async (tagId) => {
    const db = getDb();
    const objectId = ObjectId.isValid(tagId) ? new ObjectId(tagId) : tagId;
    const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: objectId });
    return result;
};

export const countTags = async (filter = {}) => {
    const db = getDb();
    return await db.collection(COLLECTION_NAME).countDocuments(filter);
};

export const searchTags = async (searchTerm, options = {}) => {
    const db = getDb();
    const { skip = 0, limit = 20 } = options;

    return await db
        .collection(COLLECTION_NAME)
        .find({
            $or: [
                { title: { $regex: searchTerm, $options: "i" } },
                { slug: { $regex: searchTerm, $options: "i" } },
            ],
        })
        .skip(skip)
        .limit(limit)
        .toArray();
};
