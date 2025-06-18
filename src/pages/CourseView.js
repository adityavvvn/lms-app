import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import authAxios from '../utils/authAxios';

function CourseView() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await authAxios.get(`/api/courses/${courseId}`);
      setCourse(response.data);
      if (response.data.chapters?.length > 0) {
        setSelectedChapter(response.data.chapters[0]);
      }
    } catch (err) {
      console.error('Error fetching course:', err);
      setError(err.response?.data?.message || 'Error fetching course');
    } finally {
      setLoading(false);
    }
  };

  const handleChapterSelect = async (chapter) => {
    setSelectedChapter(chapter);
    try {
      await authAxios.post(`/api/courses/${courseId}/progress`, {
        chapterId: chapter._id,
        completed: false,
      });
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  const handleChapterComplete = async (chapter) => {
    try {
      await authAxios.post(`/api/courses/${courseId}/progress`, {
        chapterId: chapter._id,
        completed: true,
      });
      await fetchCourse(); // Refresh course data to update progress
    } catch (err) {
      console.error('Error marking chapter as complete:', err);
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
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Course not found</Typography>
      </Container>
    );
  }

  const isChapterCompleted = (chapterId) => {
    const enrollment = course.enrolledStudents?.find(
      (e) => e && e.student && e.student._id === user._id
    );
    return enrollment?.progress?.completedChapters?.includes(chapterId);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Course Content */}
        <Grid item xs={12} md={8}>
          <Typography variant="h4" component="h1" gutterBottom>
            {course.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {course.description}
          </Typography>

          {selectedChapter ? (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h5" gutterBottom>
                {selectedChapter.title}
              </Typography>
              <Box
                sx={{
                  position: 'relative',
                  paddingTop: '56.25%', // 16:9 aspect ratio
                  mb: 2,
                }}
              >
                <iframe
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 0,
                  }}
                  src={selectedChapter.videoUrl.replace('watch?v=', 'embed/')}
                  title={selectedChapter.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Box>
              <Typography variant="body1" paragraph>
                {selectedChapter.description}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleChapterComplete(selectedChapter)}
                disabled={isChapterCompleted(selectedChapter._id)}
                sx={{ mt: 2 }}
              >
                {isChapterCompleted(selectedChapter._id)
                  ? 'Completed'
                  : 'Mark as Complete'}
              </Button>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography color="text.secondary">
                Select a chapter to start learning
              </Typography>
            </Box>
          )}
        </Grid>

        {/* Chapter List */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Course Content
              </Typography>
              <List>
                {course.chapters?.map((chapter, index) => (
                  <React.Fragment key={chapter._id}>
                    <ListItem
                      button
                      selected={selectedChapter?._id === chapter._id}
                      onClick={() => handleChapterSelect(chapter)}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemIcon>
                        {isChapterCompleted(chapter._id) ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <PlayArrowIcon />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={`${index + 1}. ${chapter.title}`}
                        secondary={chapter.duration}
                      />
                    </ListItem>
                    {index < course.chapters.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CourseView; 