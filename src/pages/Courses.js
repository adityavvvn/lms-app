import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  Box,
  LinearProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authAxios from '../utils/authAxios';
import publicAxios from '../utils/publicAxios';

function Courses() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
    if (user) {
      fetchEnrolledCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const response = await publicAxios.get('/api/public-courses');
      setCourses(response.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Error loading courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const response = await authAxios.get('/api/user/courses');
      const enrolledIds = response.data.courses.map(course => course._id);
      setEnrolledCourses(enrolledIds);
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
    }
  };

  const handleEnroll = async (courseId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setEnrolling(true);
    setEnrollError(null);

    try {
      await authAxios.post(`/api/courses/${courseId}/enroll`);
      setEnrolledCourses(prev => [...prev, courseId]);
      // Show success message
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

  const isEnrolled = (courseId) => enrolledCourses.includes(courseId);

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, letterSpacing: 1.1, mb: 4 }}>
        Available Courses
      </Typography>
      {courses.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography color="textSecondary">
            No courses available at the moment.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card
                sx={{
                  height: 320,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  borderRadius: 4,
                  boxShadow: 2,
                  bgcolor: '#fff',
                  p: 3,
                  transition: 'box-shadow 0.2s',
                  '&:hover': {
                    boxShadow: 6,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={course.thumbnail || 'https://via.placeholder.com/100x100?text=Course'}
                  alt={course.name}
                  sx={{ width: 80, height: 80, objectFit: 'contain', mb: 2, borderRadius: 2, bgcolor: '#f5f5f5' }}
                />
                <CardContent sx={{ p: 0, textAlign: 'center', flex: 1, width: '100%' }}>
                  <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 700 }}>
                    {course.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {course.description?.slice(0, 60)}{course.description?.length > 60 ? '...' : ''}
                  </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, width: '100%' }}>
                  <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    sx={{ fontWeight: 500, borderRadius: 2, mt: 1 }}
                    onClick={() => navigate(`/courses/${course._id}`)}
                  >
                    View Details
                  </Button>
                  {isEnrolled(course._id) ? (
                    <Button
                      size="small"
                      color="secondary"
                      variant="outlined"
                      sx={{ fontWeight: 500, borderRadius: 2, mt: 1, ml: 1 }}
                      onClick={() => navigate(`/courses/${course._id}/learn`)}
                    >
                      Continue Learning
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      color="secondary"
                      variant="outlined"
                      sx={{ fontWeight: 500, borderRadius: 2, mt: 1, ml: 1 }}
                      onClick={() => handleEnroll(course._id)}
                      disabled={enrolling}
                    >
                      {enrolling ? 'Enrolling...' : 'Enroll Now'}
                    </Button>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Snackbar
        open={!!enrollError}
        autoHideDuration={6000}
        onClose={() => setEnrollError(null)}
      >
        <Alert
          onClose={() => setEnrollError(null)}
          severity={enrollError?.type || 'info'}
          sx={{ width: '100%' }}
        >
          {enrollError?.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Courses; 