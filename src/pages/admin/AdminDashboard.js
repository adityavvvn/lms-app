import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  FormHelperText,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  PlaylistAdd as PlaylistAddIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import authAxios from '../../utils/authAxios';

function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'category', 'subcategory', 'course', 'chapter', 'analytics'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    subcategoryId: '',
    thumbnail: '',
    chapters: [],
  });
  const [chapterData, setChapterData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    order: 0,
    duration: '',
  });

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch categories
      console.log('Fetching categories...');
      const categoriesResponse = await authAxios.get('/api/categories');
      console.log('Categories response:', categoriesResponse.data);
      setCategories(categoriesResponse.data);

      // Fetch subcategories
      console.log('Fetching subcategories...');
      const subcategoriesResponse = await authAxios.get('/api/subcategories');
      console.log('Subcategories response:', subcategoriesResponse.data);
      setSubcategories(subcategoriesResponse.data);

      // Fetch courses
      console.log('Fetching courses...');
      const coursesResponse = await authAxios.get('/api/courses');
      console.log('Courses response:', coursesResponse.data);
      setCourses(coursesResponse.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when tab changes
  useEffect(() => {
    console.log('Component mounted or tab changed, fetching data...');
    fetchData();
  }, [tabValue]); // Re-fetch when tab changes

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setFormData({
      name: '',
      description: '',
      categoryId: '',
      subcategoryId: '',
      thumbnail: '',
      chapters: [],
    });
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      name: '',
      description: '',
      categoryId: '',
      subcategoryId: '',
      thumbnail: '',
      chapters: [],
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value,
      };
      // Reset subcategory when category changes
      if (name === 'categoryId') {
        newData.subcategoryId = '';
      }
      return newData;
    });
  };

  const handleChapterChange = (index, field, value) => {
    const newChapters = [...formData.chapters];
    newChapters[index] = { ...newChapters[index], [field]: value };
    setFormData(prev => ({ ...prev, chapters: newChapters }));
  };

  const addChapter = () => {
    setFormData(prev => ({
      ...prev,
      chapters: [...prev.chapters, { title: '', videoUrl: '' }],
    }));
  };

  const removeChapter = (index) => {
    setFormData(prev => ({
      ...prev,
      chapters: prev.chapters.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      let response;

      switch (tabValue) {
        case 0: // Categories
          response = await authAxios.post('/api/categories', {
            name: formData.name,
            description: formData.description,
          });
          setCategories([...categories, response.data]);
          break;

        case 1: // Subcategories
          response = await authAxios.post('/api/subcategories', {
            name: formData.name,
            description: formData.description,
            categoryId: formData.categoryId,
          });
          setSubcategories([...subcategories, response.data]);
          break;

        case 2: // Courses
          // Validate required fields
          if (!formData.name || !formData.description || !formData.categoryId) {
            setError('Please fill in all required fields');
            return;
          }

          response = await authAxios.post('/api/courses', {
            name: formData.name,
            description: formData.description,
            categoryId: formData.categoryId,
            subcategoryId: formData.subcategoryId,
            thumbnail: formData.thumbnail,
            chapters: formData.chapters || [],
          });
          setCourses([...courses, response.data]);
          break;

        default:
          throw new Error('Invalid tab value');
      }

      setOpenDialog(false);
      setFormData({
        name: '',
        description: '',
        categoryId: '',
        subcategoryId: '',
        thumbnail: '',
        chapters: [],
      });
    } catch (err) {
      console.error('Error creating item:', err);
      setError(err.response?.data?.message || 'Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      setError(null);

      switch (tabValue) {
        case 0: // Categories
          await authAxios.delete(`/api/categories/${id}`);
          setCategories(categories.filter((cat) => cat._id !== id));
          break;

        case 1: // Subcategories
          await authAxios.delete(`/api/subcategories/${id}`);
          setSubcategories(subcategories.filter((sub) => sub._id !== id));
          break;

        case 2: // Courses
          await authAxios.delete(`/api/courses/${id}`);
          setCourses(courses.filter((course) => course._id !== id));
          break;

        default:
          throw new Error('Invalid tab value');
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      setError(err.response?.data?.message || 'Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setFormData({
      name: course.name,
      description: course.description,
      categoryId: course.categoryId._id,
      subcategoryId: course.subcategoryId._id,
      thumbnail: course.thumbnail || '',
      chapters: course.chapters,
    });
    setDialogType('course');
    setOpenDialog(true);
  };

  const handleEditChapter = (course, chapter) => {
    setSelectedCourse(course);
    setChapterData({
      title: chapter.title,
      description: chapter.description,
      videoUrl: chapter.videoUrl,
      order: chapter.order,
      duration: chapter.duration || '',
    });
    setDialogType('chapter');
    setOpenDialog(true);
  };

  const calculateStudentProgress = (course, studentId) => {
    const enrollment = course.enrolledStudents.find(e => e.student._id === studentId);
    if (!enrollment) return 0;
    
    const totalChapters = course.chapters.length;
    if (totalChapters === 0) return 0;
    
    const completedChapters = enrollment.progress.completedChapters.length;
    return (completedChapters / totalChapters) * 100;
  };

  const renderDialogContent = () => {
    if (!selectedCourse) return null;

    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          {selectedCourse.name} - Student Progress
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Last Accessed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedCourse.enrolledStudents.map((enrollment) => (
                <TableRow key={enrollment.student._id}>
                  <TableCell>{enrollment.student.name}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={calculateStudentProgress(selectedCourse, enrollment.student._id)} 
                        />
                      </Box>
                      <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="text.secondary">
                          {`${Math.round(calculateStudentProgress(selectedCourse, enrollment.student._id))}%`}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {new Date(enrollment.lastAccessed).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  const renderList = () => {
    const items = tabValue === 0 ? categories : tabValue === 1 ? subcategories : courses;
    const type = tabValue === 0 ? 'category' : tabValue === 1 ? 'subcategory' : 'course';

    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <LinearProgress sx={{ width: '100%' }} />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ color: 'error.main', mt: 2 }}>
          <Typography>{error}</Typography>
        </Box>
      );
    }

    if (items.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography color="textSecondary">
            No {type}s found. Click the "Add {type}" button to create one.
          </Typography>
        </Box>
      );
    }

    return (
      <List>
        {items.map((item) => (
          <ListItem
            key={item._id}
            sx={{
              mb: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemText
              primary={item.name}
              secondary={
                type === 'course' ? (
                  <>
                    <Typography component="span" variant="body2" color="textPrimary">
                      {item.categoryId?.name} &gt; {item.subcategoryId?.name}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2" color="textSecondary">
                      {item.chapters?.length || 0} chapters • {item.analytics?.totalEnrollments || 0} students enrolled
                    </Typography>
                  </>
                ) : (
                  item.description
                )
              }
            />
            <ListItemSecondaryAction>
              {type === 'course' && (
                <>
                  <IconButton
                    edge="end"
                    aria-label="analytics"
                    onClick={() => {
                      setSelectedCourse(item);
                      setDialogType('analytics');
                      setOpenDialog(true);
                    }}
                    sx={{ mr: 1 }}
                  >
                    <AnalyticsIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEditCourse(item)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                </>
              )}
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDelete(item._id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setFormData({
              name: '',
              description: '',
              categoryId: '',
              subcategoryId: '',
              thumbnail: '',
              chapters: [],
            });
            setDialogType(tabValue === 0 ? 'category' : tabValue === 1 ? 'subcategory' : 'course');
            setOpenDialog(true);
          }}
        >
          Add {tabValue === 0 ? 'Category' : tabValue === 1 ? 'Subcategory' : 'Course'}
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={`Categories (${categories.length})`} />
          <Tab label={`Subcategories (${subcategories.length})`} />
          <Tab label={`Courses (${courses.length})`} />
        </Tabs>
      </Box>

      {renderList()}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth={dialogType === 'analytics' ? 'md' : 'sm'}
        fullWidth
      >
        <DialogTitle>
          {dialogType === 'category'
            ? 'Add Category'
            : dialogType === 'subcategory'
            ? 'Add Subcategory'
            : dialogType === 'course'
            ? (selectedCourse ? 'Edit Course' : 'Add Course')
            : dialogType === 'chapter'
            ? (chapterData._id ? 'Edit Chapter' : 'Add Chapter')
            : 'Course Analytics'}
        </DialogTitle>
        <DialogContent>
          {renderDialogContent()}
        </DialogContent>
        {dialogType !== 'analytics' && (
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {selectedCourse ? 'Save Changes' : 'Add'}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Container>
  );
}

export default AdminDashboard; 