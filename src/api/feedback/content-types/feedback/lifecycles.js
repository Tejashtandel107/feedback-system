'use strict';

module.exports = {
  async afterCreate(event) {
    const teacherRelation = event.params.data.teacher;

    if (!teacherRelation) return;

    // Get teacher id
    const teacherId = teacherRelation.set?.[0]?.id;

    if (!teacherId) return;

    // Get all feedbacks of teacher
    const feedbacks = await strapi.entityService.findMany(
      'api::feedback.feedback',
      {
        filters: {
          teacher: teacherId,
        },
      }
    );

    // Count feedbacks
    const totalFeedbacks = feedbacks.length;

    // Total rating
    const totalRating = feedbacks.reduce(
      (sum, item) => sum + (item.rating || 0),
      0
    );

    // Average
    const averageRating =
      totalFeedbacks > 0
        ? totalRating / totalFeedbacks
        : 0;

    // Update teacher
    await strapi.entityService.update(
      'api::teacher.teacher',
      teacherId,
      {
        data: {
          totalFeedbacks,
          averageRating,
        },
      }
    );
  },
};