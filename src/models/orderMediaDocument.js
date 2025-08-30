const db = require("../../db");

const orderMediaDocument = {
  // Find document by ID
  findById: async (id) => {
    const document = await db("order_media_documents")
      .where({ id })
      .whereNull("deleted_at")
      .first();

    return document;
  },

  // Find documents by order ID
  findByOrderId: async (orderId) => {
    const documents = await db("order_media_documents")
      .where({ order_id: orderId })
      .whereNull("deleted_at")
      .orderBy("created_at", "desc");

    return documents;
  },

  // Find documents by type
  findByType: async (documentType) => {
    const documents = await db("order_media_documents")
      .where({ document_type: documentType })
      .whereNull("deleted_at")
      .orderBy("created_at", "desc");

    return documents;
  },

  // Find documents by media type
  findByMediaType: async (mediaType) => {
    const documents = await db("order_media_documents")
      .where({ media_type: mediaType })
      .whereNull("deleted_at")
      .orderBy("created_at", "desc");

    return documents;
  },

  // Insert a new document record
  createDocument: async (documentData) => {
    const [result] = await db("order_media_documents")
      .insert(documentData)
      .returning("id");

    return result.id;
  },

  // Soft delete document
  softDelete: async (id, deletedBy) => {
    const result = await db("order_media_documents")
      .where({ id })
      .whereNull("deleted_at")
      .update({
        deleted_at: new Date(),
        deleted_by: deletedBy,
      });

    return result > 0;
  },

  // Get document count by order ID
  countByOrderId: async (orderId) => {
    const result = await db("order_media_documents")
      .where({ order_id: orderId })
      .whereNull("deleted_at")
      .count("id as count")
      .first();

    return parseInt(result.count);
  },
};

module.exports = orderMediaDocument;
