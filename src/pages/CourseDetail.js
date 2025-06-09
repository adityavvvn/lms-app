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

  useEffect(() => {
    fetchCourse();
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
                      secondary={`${chapter.type.charAt(0).toUpperCase() + chapter.type.slice(1)} • ${chapter.duration || 'N/A'}`}
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