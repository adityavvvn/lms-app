import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
  Box,
  LinearProgress,
  Alert,
  Rating,
  TextField,
} from '@mui/material';
import {
  PlayCircleOutline,
  Assignment,
  Quiz,
  Description,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import authAxios from '../utils/authAxios';

function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    fetchCourse();
    fetchReviews();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await authAxios.get(`/api/courses/${courseId}`);
      setCourse(response.data);
      // Check if user is enrolled
      if (user) {
        const isUserEnrolled = response.data.enrolledStudents?.some(
          e => e.student._id === user._id
        );
        setIsEnrolled(isUserEnrolled);
      }
    } catch (err) {
      console.error('Error fetching course:', err);
      setError(err.response?.data?.message || 'Error fetching course');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await authAxios.get(`/api/courses/${courseId}/reviews`);
      setReviews(res.data);
    } catch (err) {
      setReviews([]);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setEnrolling(true);
    setEnrollError(null);

    try {
      await authAxios.post(`/api/courses/${courseId}/enroll`);
      setIsEnrolled(true);
      setEnrollError({ type: 'success', message: 'Successfully enrolled in course!' });
    } catch (err) {
      console.error('Error enrolling in course:', err);
      setEnrollError({
        type: 'error',
        message: err.response?.data?.message || 'Error enrolling in course'
      });
    } finally {
      setEnrolling(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');
    setReviewLoading(true);
    try {
      await authAxios.post(`/api/courses/${courseId}/reviews`, {
        rating: reviewRating,
        text: reviewText,
      });
      setReviewSuccess('Review submitted!');
      setReviewText('');
      setReviewRating(0);
      fetchReviews();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5">Course not found</Typography>
      </Container>
    );
  }

  const getChapterIcon = (type) => {
    switch (type) {
      case 'video':
        return <PlayCircleOutline />;
      case 'assignment':
        return <Assignment />;
      case 'quiz':
        return <Quiz />;
      default:
        return <Description />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Course Header */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {course.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Category: {course.categoryId?.name || 'Uncategorized'} | 
              Subcategory: {course.subcategoryId?.name || 'None'}
            </Typography>
            <Typography variant="body1" paragraph>
              {course.description}
            </Typography>
            {isEnrolled ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/courses/${course._id}/learn`)}
              >
                Continue Learning
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleEnroll}
                disabled={enrolling}
              >
                {enrolling ? 'Enrolling...' : 'Enroll in Course'}
              </Button>
            )}
          </Paper>
        </Grid>

        {/* Course Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Course Content
            </Typography>
            <List>
              {course.chapters?.map((chapter, index) => (
                <React.Fragment key={chapter._id}>
                  <ListItem>
                    <ListItemIcon>
                      {getChapterIcon(chapter.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={`${index + 1}. ${chapter.title}`}
                      secondary={`${(chapter.type ? chapter.type.charAt(0).toUpperCase() + chapter.type.slice(1) : 'Unknown')} • ${chapter.duration || 'N/A'}`}
                    />
                    {isEnrolled ? (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/courses/${course._id}/learn?chapter=${chapter._id}`)}
                      >
                        Start
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        disabled
                      >
                        Locked
                      </Button>
                    )}
                  </ListItem>
                  {index < course.chapters.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Course Information */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Course Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Total Chapters
              </Typography>
              <Typography variant="h4">
                {course.chapters?.length || 0}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Enrolled Students
              </Typography>
              <Typography variant="h4">
                {course.enrolledStudents?.length || 0}
              </Typography>
            </Box>
            {course.analytics && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Average Progress
                </Typography>
                <Typography variant="h4">
                  {Math.round(course.analytics.averageProgress || 0)}%
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Review and Rating Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Reviews & Ratings
        </Typography>
        {/* Average Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating
            value={
              reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0
            }
            precision={0.5}
            readOnly
          />
          <Typography sx={{ ml: 1 }}>
            {reviews.length > 0
              ? `${(
                  reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                ).toFixed(1)} / 5 (${reviews.length} review${reviews.length > 1 ? 's' : ''})`
              : 'No reviews yet'}
          </Typography>
        </Box>
        {/* Review Form (enrolled users only) */}
        {isEnrolled && (
          <Box component="form" onSubmit={handleReviewSubmit} sx={{ mb: 4, maxWidth: 500 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Leave a Review
            </Typography>
            <Rating
              name="rating"
              value={reviewRating}
              onChange={(_, newValue) => setReviewRating(newValue)}
              precision={1}
              sx={{ mb: 1 }}
              required
            />
            <TextField
              label="Your feedback"
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              fullWidth
              multiline
              minRows={2}
              maxRows={4}
              required
              sx={{ mb: 2 }}
            />
            {reviewError && <Alert severity="error" sx={{ mb: 2 }}>{reviewError}</Alert>}
            {reviewSuccess && <Alert severity="success" sx={{ mb: 2 }}>{reviewSuccess}</Alert>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={reviewLoading || !reviewRating || !reviewText}
            >
              {reviewLoading ? 'Submitting...' : 'Submit Review'}
            </Button>
          </Box>
        )}
        {/* List of Reviews */}
        <Box>
          {reviews.length === 0 ? (
            <Typography color="textSecondary">No reviews yet.</Typography>
          ) : (
            reviews.map((r, idx) => (
              <Paper key={idx} sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={r.rating} readOnly size="small" />
                  <Typography sx={{ ml: 1, fontWeight: 500 }}>{r.user?.name || 'User'}</Typography>
                  <Typography sx={{ ml: 2, color: 'text.secondary', fontSize: 13 }}>
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}
                  </Typography>
                </Box>
                <Typography>{r.text}</Typography>
              </Paper>
            ))
          )}
        </Box>
      </Box>

      {enrollError && (
        <Alert
          severity={enrollError.type}
          sx={{ mt: 2 }}
          onClose={() => setEnrollError(null)}
        >
          {enrollError.message}
        </Alert>
      )}
    </Container>
  );
}

export default CourseDetail; 