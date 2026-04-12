import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../../App';
import { Trash2, Star, ChevronLeft, ChevronRight, Loader2, MessageCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverUrl}/api/admin/reviews`, {
        params: { page: currentPage, limit: 10 },
        withCredentials: true
      });
      setReviews(response.data.reviews);
      setTotalPages(response.data.pages);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [currentPage]);

  const handleDeleteReview = async () => {
    if (!selectedReview) return;
    try {
      await axios.delete(`${serverUrl}/api/admin/reviews/${selectedReview._id}`, {
        withCredentials: true
      });
      toast.success('Review deleted successfully');
      setShowDeleteModal(false);
      setSelectedReview(null);
      fetchReviews();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Reviews</h1>
        <p className="text-gray-500 mt-1">View and moderate user reviews</p>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-3">
                  {review.user?.photoUrl ? (
                    <img src={review.user.photoUrl} alt={review.user.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <span className="text-white font-medium">{review.user?.name?.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{review.user?.name}</p>
                    <p className="text-xs text-gray-500">{review.user?.email}</p>
                  </div>
                </div>

                {/* Course Info */}
                <div className="mb-3">
                  <span className="text-xs text-blue-600 font-medium">Course:</span>
                  <p className="text-sm font-medium text-gray-800">{review.course?.title}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-sm font-medium text-gray-600 ml-2">({review.rating}/5)</span>
                </div>

                {/* Comment */}
                {review.comment && (
                  <div className="bg-gray-50 rounded-lg p-3 mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageCircle className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">Review</span>
                    </div>
                    <p className="text-gray-700 text-sm">{review.comment}</p>
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-3">
                  {new Date(review.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedReview(review);
                  setShowDeleteModal(true);
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-12">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No reviews found</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Review</h2>
            <p className="text-gray-500 mb-4">
              Are you sure you want to delete this review by {selectedReview.user?.name}?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedReview(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteReview}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;