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
  Alert,
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
import publicAxios from '../../utils/publicAxios';

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
  const [admins, setAdmins] = useState([]);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '' });
  const [userFormLoading, setUserFormLoading] = useState(false);
  const [userFormError, setUserFormError] = useState('');
  const [userFormSuccess, setUserFormSuccess] = useState('');

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch categories
      console.log('Fetching categories...');
      const categoriesResponse = await publicAxios.get('/api/categories');
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

      // Fetch admins
      const adminsResponse = await authAxios.get('/api/users?role=admin');
      setAdmins(adminsResponse.data);
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

  const handleEditChapter = (course, chapter, chapterIndex) => {
    setSelectedCourse(course);
    setChapterData({
      _id: chapter._id,
      title: chapter.title,
      description: chapter.description,
      videoUrl: chapter.videoUrl,
      order: chapter.order || chapterIndex + 1,
      duration: chapter.duration || '',
    });
    setDialogType('chapter');
    setOpenDialog(true);
  };

  const handleAddChapter = (course) => {
    setSelectedCourse(course);
    setChapterData({
      title: '',
      description: '',
      videoUrl: '',
      order: course.chapters.length + 1,
      duration: '',
    });
    setDialogType('chapter');
    setOpenDialog(true);
  };

  const handleChapterSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      
      const updatedChapters = [...selectedCourse.chapters];
      
      if (chapterData._id) {
        // Edit existing chapter
        const chapterIndex = updatedChapters.findIndex(ch => ch._id === chapterData._id);
        if (chapterIndex !== -1) {
          updatedChapters[chapterIndex] = { ...chapterData };
        }
      } else {
        // Add new chapter
        updatedChapters.push({
          ...chapterData,
          _id: Date.now().toString(), // Temporary ID for frontend
        });
      }

      // Sort chapters by order
      updatedChapters.sort((a, b) => a.order - b.order);

      const response = await authAxios.put(`/api/courses/${selectedCourse._id}`, {
        name: selectedCourse.name,
        description: selectedCourse.description,
        categoryId: selectedCourse.categoryId._id || selectedCourse.categoryId,
        subcategoryId: selectedCourse.subcategoryId._id || selectedCourse.subcategoryId,
        thumbnail: selectedCourse.thumbnail,
        chapters: updatedChapters,
      });

      // Update the course in the list
      setCourses(courses.map(course => 
        course._id === selectedCourse._id ? response.data : course
      ));

      setOpenDialog(false);
      setChapterData({
        title: '',
        description: '',
        videoUrl: '',
        order: 1,
        duration: '',
      });
    } catch (err) {
      console.error('Error updating chapters:', err);
      setError(err.response?.data?.message || 'Failed to update chapters');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveChapter = async (course, chapterId) => {
    try {
      setLoading(true);
      
      const updatedChapters = selectedCourse.chapters.filter(ch => ch._id !== chapterId);
      
      const response = await authAxios.put(`/api/courses/${course._id}`, {
        name: course.name,
        description: course.description,
        categoryId: course.categoryId._id || course.categoryId,
        subcategoryId: course.subcategoryId._id || course.subcategoryId,
        thumbnail: course.thumbnail,
        chapters: updatedChapters,
      });

      // Update the course in the list
      setCourses(courses.map(c => c._id === course._id ? response.data : c));
    } catch (err) {
      console.error('Error removing chapter:', err);
      setError(err.response?.data?.message || 'Failed to remove chapter');
    } finally {
      setLoading(false);
    }
  };

  const handleChapterDataChange = (field, value) => {
    setChapterData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateYouTubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
  };

  const calculateStudentProgress = (course, studentId) => {
    const enrollment = course.enrolledStudents.find(e => e && e.student && e.student._id === studentId);
    if (!enrollment) return 0;
    
    const totalChapters = course.chapters.length;
    if (totalChapters === 0) return 0;
    
    const completedChapters = enrollment.progress?.completedChapters?.length || 0;
    return (completedChapters / totalChapters) * 100;
  };

  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserFormSubmit = async (e) => {
    e.preventDefault();
    setUserFormError('');
    setUserFormSuccess('');
    setUserFormLoading(true);
    try {
      const res = await authAxios.post('/api/admin/users', userForm);
      setUserFormSuccess('Admin user created successfully!');
      setUserForm({ name: '', email: '', password: '' });
      // Refresh admin list
      const adminsResponse = await authAxios.get('/api/users?role=admin');
      setAdmins(adminsResponse.data);
    } catch (err) {
      setUserFormError(err.response?.data?.message || 'Failed to create admin user');
    } finally {
      setUserFormLoading(false);
    }
  };

  // Fetch full course details (with populated students) for analytics
  const handleOpenAnalytics = async (course) => {
    try {
      const res = await authAxios.get(`/api/courses/${course._id}`);
      setSelectedCourse(res.data);
      setDialogType('analytics');
      setOpenDialog(true);
    } catch (err) {
      console.error('Failed to fetch course analytics:', err);
    }
  };

  const renderDialogContent = () => {
    if (dialogType === 'analytics' && selectedCourse) {
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
                {selectedCourse.enrolledStudents
                  .filter(enrollment => enrollment && enrollment.student)
                  .map((enrollment) => (
                  <TableRow key={enrollment.student._id}>
                    <TableCell>{enrollment.student?.name || enrollment.student?.email || 'Unknown'}</TableCell>
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
                      {enrollment.lastAccessed ? new Date(enrollment.lastAccessed).toLocaleDateString() : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      );
    }

    if (dialogType === 'chapter') {
      return (
        <Box component="form" onSubmit={handleChapterSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Chapter Title"
            value={chapterData.title}
            onChange={(e) => handleChapterDataChange('title', e.target.value)}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={chapterData.description}
            onChange={(e) => handleChapterDataChange('description', e.target.value)}
            margin="normal"
            multiline
            rows={2}
          />
          <TextField
            fullWidth
            label="YouTube Video URL"
            value={chapterData.videoUrl}
            onChange={(e) => handleChapterDataChange('videoUrl', e.target.value)}
            required
            margin="normal"
            helperText="Enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)"
            error={chapterData.videoUrl && !validateYouTubeUrl(chapterData.videoUrl)}
          />
          <TextField
            fullWidth
            label="Order"
            type="number"
            value={chapterData.order}
            onChange={(e) => handleChapterDataChange('order', parseInt(e.target.value) || 1)}
            required
            margin="normal"
            inputProps={{ min: 1 }}
          />
          <TextField
            fullWidth
            label="Duration (e.g., 15:30)"
            value={chapterData.duration}
            onChange={(e) => handleChapterDataChange('duration', e.target.value)}
            margin="normal"
            helperText="Optional: Video duration in MM:SS format"
          />
        </Box>
      );
    }

    // Form for categories, subcategories, and courses
    return (
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleFormChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleFormChange}
          required
          margin="normal"
          multiline
          rows={3}
        />
        
        {dialogType === 'subcategory' && (
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Category</InputLabel>
            <Select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleFormChange}
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {dialogType === 'course' && (
          <>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Category</InputLabel>
              <Select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleFormChange}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Subcategory</InputLabel>
              <Select
                name="subcategoryId"
                value={formData.subcategoryId}
                onChange={handleFormChange}
                label="Subcategory"
                disabled={!formData.categoryId}
              >
                {subcategories
                  .filter(sub => {
                    if (!formData.categoryId) return true;
                    const subCategoryId = sub.categoryId._id || sub.categoryId;
                    return subCategoryId === formData.categoryId;
                  })
                  .map((subcategory) => (
                    <MenuItem key={subcategory._id} value={subcategory._id}>
                      {subcategory.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Thumbnail URL"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleFormChange}
              margin="normal"
              helperText="Optional: URL for course thumbnail image"
            />

            {/* Chapter Management Section */}
            <Box sx={{ mt: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Chapters</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => handleAddChapter(selectedCourse)}
                >
                  Add Chapter
                </Button>
              </Box>
              
              {selectedCourse?.chapters?.length > 0 ? (
                <List dense>
                  {selectedCourse.chapters
                    .sort((a, b) => a.order - b.order)
                    .map((chapter, index) => (
                    <ListItem
                      key={chapter._id}
                      sx={{
                        border: '1px solid #f0f0f0',
                        borderRadius: 1,
                        mb: 1,
                        bgcolor: 'background.paper',
                      }}
                    >
                      <ListItemText
                        primary={`${chapter.order}. ${chapter.title}`}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {chapter.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Duration: {chapter.duration || 'N/A'} | URL: {chapter.videoUrl}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => handleEditChapter(selectedCourse, chapter, index)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => handleRemoveChapter(selectedCourse, chapter._id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                  No chapters added yet. Click "Add Chapter" to get started.
                </Typography>
              )}
            </Box>
          </>
        )}
      </Box>
    );
  };

  const renderChapterList = () => {
    // Flatten all chapters from courses, include course info
    const chapterRows = courses
      .filter(course => course.admin?._id === user?._id) // Only admin's courses
      .flatMap(course =>
        (course.chapters || []).map((chapter, idx) => ({
          ...chapter,
          courseName: course.name,
          courseId: course._id,
          course,
        }))
      );
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <LinearProgress sx={{ width: '100%' }} />
        </Box>
      );
    }
    if (chapterRows.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography color="textSecondary">
            No chapters found for your courses.
          </Typography>
        </Box>
      );
    }
    return (
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Video URL</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chapterRows.map((chapter, idx) => (
              <TableRow key={chapter._id || `${chapter.courseId}-${idx}`}> 
                <TableCell>{chapter.courseName}</TableCell>
                <TableCell>{chapter.title}</TableCell>
                <TableCell>{chapter.order}</TableCell>
                <TableCell>{chapter.duration || '-'}</TableCell>
                <TableCell>
                  <a href={chapter.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>
                    Video Link
                  </a>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleEditChapter(chapter.course, chapter, chapter.order - 1)} sx={{ mr: 1 }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleRemoveChapter(chapter.course, chapter._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderUserManagement = () => (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>Admin Users</Typography>
      <TableContainer component={Paper} sx={{ mb: 4, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin._id || admin.id}>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.createdAt ? new Date(admin.createdAt).toLocaleString() : ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h6" sx={{ mb: 2 }}>Create New Admin</Typography>
      <Box component="form" onSubmit={handleUserFormSubmit} sx={{ maxWidth: 400 }}>
        <TextField
          label="Full Name"
          name="name"
          value={userForm.name}
          onChange={handleUserFormChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={userForm.email}
          onChange={handleUserFormChange}
          fullWidth
          required
          margin="normal"
          type="email"
        />
        <TextField
          label="Password"
          name="password"
          value={userForm.password}
          onChange={handleUserFormChange}
          fullWidth
          required
          margin="normal"
          type="password"
        />
        {userFormError && <Alert severity="error" sx={{ mt: 2 }}>{userFormError}</Alert>}
        {userFormSuccess && <Alert severity="success" sx={{ mt: 2 }}>{userFormSuccess}</Alert>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2, fontWeight: 500, borderRadius: 2 }}
          disabled={userFormLoading}
        >
          {userFormLoading ? 'Creating...' : 'Create Admin'}
        </Button>
      </Box>
    </Box>
  );

  const renderList = () => {
    if (tabValue === 3) {
      return renderChapterList();
    }
    if (tabValue === 4) {
      return renderUserManagement();
    }
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

    // Modern card/grid layout
    return (
      <Grid container spacing={4}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card
              sx={{
                height: 220,
                minHeight: 220,
                maxHeight: 220,
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
              {/* Placeholder icon/image */}
              <Box sx={{ width: 64, height: 64, mb: 2, bgcolor: '#f5f5f5', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h3" color="text.secondary">
                  {item.name?.charAt(0) || '?'}
                </Typography>
              </Box>
              <CardContent sx={{ p: 0, textAlign: 'center', flex: 1, width: '100%' }}>
                <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 700 }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {item.description?.slice(0, 60)}{item.description?.length > 60 ? '...' : ''}
                </Typography>
              </CardContent>
              {/* Existing actions (edit, delete, analytics, etc.) */}
              {type === 'course' && (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, width: '100%' }}>
                  <IconButton
                    edge="end"
                    aria-label="analytics"
                    onClick={() => handleOpenAnalytics(item)}
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
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(item._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
              {type !== 'course' && (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, width: '100%' }}>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEditCourse(item)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(item._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        {tabValue !== 3 && tabValue !== 4 && (
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
        )}
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={`Categories (${categories.length})`} />
          <Tab label={`Subcategories (${subcategories.length})`} />
          <Tab label={`Courses (${courses.length})`} />
          <Tab label="Chapters" />
          <Tab label="User Management" />
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
            <Button 
              onClick={dialogType === 'chapter' ? handleChapterSubmit : handleSubmit} 
              variant="contained" 
              color="primary"
              disabled={dialogType === 'chapter' && (!chapterData.title || !chapterData.videoUrl || !validateYouTubeUrl(chapterData.videoUrl))}
            >
              {dialogType === 'chapter' 
                ? (chapterData._id ? 'Update Chapter' : 'Add Chapter')
                : (selectedCourse ? 'Save Changes' : 'Add')
              }
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Container>
  );
}

export default AdminDashboard; 