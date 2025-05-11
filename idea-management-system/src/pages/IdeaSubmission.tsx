import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Snackbar,
  Alert,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Container,
  Card,
  CardContent,
  useTheme,
  Chip,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  StepButton,
  MobileStepper
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  AttachFile,
  Lightbulb,
  EmojiObjects,
  Celebration,
  StarRate,
  PictureAsPdf,
  Description,
  ArrowBack,
  ArrowForward,
  Check,
  Info,
  Assessment,
  Upload,
  Send,
  InsertDriveFile,
  TableChart,
  Slideshow,
  Article
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { categories } from '../mockData';
import { useAuth } from '../contexts/AuthContext';
import { submitIdea } from '../services/ideaService';

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
// Allowed file types
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain'
];

// Validation schema
const validationSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .max(100, 'Title must be 100 characters or less'),
  description: Yup.string()
    .required('Description is required')
    .min(50, 'Description must be at least 50 characters'),
  category: Yup.string()
    .required('Category is required'),
  benefits: Yup.string()
    .required('Expected benefits are required')
    .min(30, 'Benefits must be at least 30 characters'),
});

interface FileWithPreview extends File {
  preview?: string;
  id?: string; // Unique identifier for each file
}

// Animation timing values (ms)
const HERO_ANIMATION_DURATION = 1000;
const FORM_ANIMATION_DURATION = 800;
const FIELD_ANIMATION_DELAY = 100;

const IdeaSubmission = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<FileWithPreview[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Animation states
  const [formLoaded, setFormLoaded] = useState(false);

  // Step form state
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Basic Info', 'Describe Your Idea', 'Benefits & Impact', 'Attachments', 'Review & Submit'];

  // Set form loaded after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setFormLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      category: '',
      benefits: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        // Convert files to base64 or URLs (in a real app, files would be uploaded to a server)
        const attachmentUrls = attachments.map(file => 
          URL.createObjectURL(file)
        );
        
        // Submit idea
        const submittedIdea = await submitIdea({
          title: values.title,
          description: values.description,
          category: values.category,
          benefits: values.benefits,
          submitterId: currentUser?.id || '',
          attachments: attachmentUrls,
        });
        
        // Show success message
        setSuccessMessage(`Your idea has been submitted successfully! Tracking ID: ${submittedIdea.id}`);
        
        // Reset form
        formik.resetForm();
        setAttachments([]);
        
        // Navigate to dashboard after a delay
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (error) {
        console.error('Error submitting idea:', error);
        setSuccessMessage(null);
        alert('Failed to submit idea. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;

    const newFiles = Array.from(event.target.files);

    // Validate file size and type
    const invalidFiles = newFiles.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`File "${file.name}" exceeds the maximum size of 5MB`);
        return true;
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setFileError(`File type "${file.type}" is not supported`);
        return true;
      }
      return false;
    });

    if (invalidFiles.length) {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Create preview URLs for the valid files
    const filesWithPreview = newFiles.map(file => {
      // Create a unique ID for each file
      const fileWithId = file as FileWithPreview;
      fileWithId.id = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Generate preview for image files
      if (file.type.startsWith('image/')) {
        fileWithId.preview = URL.createObjectURL(file);
      } else {
        // Set default preview for different file types
        const fileType = file.type.split('/')[0];
        switch(fileType) {
          case 'application':
            if (file.type.includes('pdf')) {
              fileWithId.preview = 'pdf-icon';
            } else if (file.type.includes('word') || file.type.includes('document')) {
              fileWithId.preview = 'doc-icon';
            } else if (file.type.includes('sheet') || file.type.includes('excel')) {
              fileWithId.preview = 'sheet-icon';
            } else if (file.type.includes('presentation') || file.type.includes('powerpoint')) {
              fileWithId.preview = 'presentation-icon';
            } else {
              fileWithId.preview = 'generic-icon';
            }
            break;
          case 'text':
            fileWithId.preview = 'text-icon';
            break;
          default:
            fileWithId.preview = 'generic-icon';
        }
      }

      return fileWithId;
    });

    setFileError(null);
    setAttachments(prev => [...prev, ...filesWithPreview]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachments(prev => {
      // Revoke object URL if it's an image preview
      const file = prev[index];
      if (file.preview && typeof file.preview === 'string' && file.preview.startsWith('blob:')) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup function to revoke all object URLs
      attachments.forEach(file => {
        if (file.preview && typeof file.preview === 'string' && file.preview.startsWith('blob:')) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [attachments]);

  const handleSnackbarClose = () => {
    setSuccessMessage(null);
  };

  // Handle step navigation
  const handleNext = () => {
    // Validate current step before proceeding
    let canProceed = true;

    // Step 0: Validate title and category
    if (activeStep === 0) {
      if (!formik.values.title || !formik.values.category) {
        if (!formik.values.title) {
          formik.setFieldTouched('title', true, true);
          formik.setFieldError('title', 'Title is required');
        }
        if (!formik.values.category) {
          formik.setFieldTouched('category', true, true);
          formik.setFieldError('category', 'Category is required');
        }
        canProceed = false;
      }
    }

    // Step 1: Validate description
    else if (activeStep === 1) {
      if (!formik.values.description || formik.values.description.length < 50) {
        formik.setFieldTouched('description', true, true);
        formik.setFieldError('description',
          !formik.values.description
            ? 'Description is required'
            : 'Description must be at least 50 characters'
        );
        canProceed = false;
      }
    }

    // Step 2: Validate benefits
    else if (activeStep === 2) {
      if (!formik.values.benefits || formik.values.benefits.length < 30) {
        formik.setFieldTouched('benefits', true, true);
        formik.setFieldError('benefits',
          !formik.values.benefits
            ? 'Expected benefits are required'
            : 'Benefits must be at least 30 characters'
        );
        canProceed = false;
      }
    }

    // If validated, go to next step
    if (canProceed) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleStepClick = (step: number) => {
    // Only allow clicking on completed steps or the next available step
    if (step <= activeStep + 1) {
      setActiveStep(step);
    }
  };

  if (!currentUser) {
    return (
      <Box>
        <Typography variant="h6">Please log in to submit an idea.</Typography>
      </Box>
    );
  }

  // Get theme for consistent colors
  const theme = useTheme();

  // Field animation props generator
  const getFieldAnimation = (index: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: formLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: {
      duration: 0.4,
      delay: 0.2 + (index * 0.1),
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  });

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Hero Section with Illustration */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          padding: '3rem 1rem',
          borderRadius: '0 0 20px 20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          mb: 6,
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <Box>
                  <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{
                      color: '#fff',
                      fontWeight: 'bold',
                      textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                    }}
                  >
                    Submit Your Brilliant Idea
                  </Typography>
                  <Typography
                    variant="h6"
                    paragraph
                    sx={{ color: 'rgba(255,255,255,0.9)' }}
                  >
                    Great innovations start with a single idea. Share yours today and help shape our future!
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                    <Chip
                      icon={<StarRate />}
                      label="Simple Process"
                      sx={{ bgcolor: 'rgba(255,255,255,0.9)', fontWeight: 'bold' }}
                    />
                    <Chip
                      icon={<Celebration />}
                      label="Quick Review"
                      sx={{ bgcolor: 'rgba(255,255,255,0.9)', fontWeight: 'bold' }}
                    />
                    <Chip
                      icon={<Lightbulb />}
                      label="Make an Impact"
                      sx={{ bgcolor: 'rgba(255,255,255,0.9)', fontWeight: 'bold' }}
                    />
                  </Box>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative'
                  }}
                >
                  {/* Decorative Elements */}
                  <Box sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <EmojiObjects
                      sx={{
                        fontSize: 180,
                        color: 'rgba(255,255,255,0.85)',
                        filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5))'
                      }}
                    />
                    {[...Array(5)].map((_, i) => (
                      <Lightbulb
                        key={i}
                        sx={{
                          fontSize: 20 + Math.random() * 40,
                          position: 'absolute',
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          color: 'rgba(255,255,255,0.7)',
                          transform: `rotate(${Math.random() * 360}deg)`,
                          opacity: 0.5 + Math.random() * 0.5
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Form Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <Card elevation={4} sx={{
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2, fontWeight: 'medium' }}>
                <Lightbulb sx={{ mr: 1, verticalAlign: 'middle', color: theme.palette.primary.main }} />
                Share Your Idea Details
              </Typography>

              {/* Stepper */}
              <Box sx={{ mb: 4, display: { xs: 'none', md: 'block' } }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label, index) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: { optional?: React.ReactNode } = {};

                    return (
                      <Step key={label} {...stepProps}>
                        <StepButton
                          onClick={() => handleStepClick(index)}
                          disabled={index > activeStep + 1}
                        >
                          <StepLabel {...labelProps}>{label}</StepLabel>
                        </StepButton>
                      </Step>
                    );
                  })}
                </Stepper>
              </Box>

              {/* Mobile Stepper */}
              <Box sx={{ mb: 4, display: { xs: 'block', md: 'none' } }}>
                <MobileStepper
                  variant="dots"
                  steps={steps.length}
                  position="static"
                  activeStep={activeStep}
                  sx={{
                    bgcolor: 'transparent',
                    '& .MuiMobileStepper-dot': { mx: 0.5 },
                    '& .MuiMobileStepper-dotActive': { bgcolor: theme.palette.primary.main }
                  }}
                  nextButton={
                    <Typography variant="body2" color="primary">
                      {steps[activeStep]}
                    </Typography>
                  }
                  backButton={
                    <Box />
                  }
                />
              </Box>

              <Divider sx={{ mb: 4 }} />
              <form onSubmit={formik.handleSubmit}>
                <Box>
                  {activeStep === 0 && (
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <TextField
                    fullWidth
                    id="title"
                    name="title"
                    label="Idea Title"
                    placeholder="Enter a catchy title for your idea"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.2)'
                        },
                        transition: 'box-shadow 0.3s'
                      }
                    }}
                  />
                </motion.div>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  error={formik.touched.category && Boolean(formik.errors.category)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.2)'
                      },
                      transition: 'box-shadow 0.3s'
                    }
                  }}
                >
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    name="category"
                    value={formik.values.category}
                    label="Category"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 300,
                          borderRadius: 2,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                        }
                      }
                    }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.category && formik.errors.category && (
                    <FormHelperText>{formik.errors.category}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom fontWeight="medium" sx={{ mt: 2, mb: 1 }}>
                  Describe Your Idea
                </Typography>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Description"
                  placeholder="What problem does your idea solve? How would it be implemented?"
                  multiline
                  rows={6}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={
                    (formik.touched.description && formik.errors.description) ||
                    "Provide a detailed explanation of your idea. Be specific about the problem it addresses and how it could be implemented."
                  }
                  variant="outlined"
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.2)'
                      },
                      transition: 'box-shadow 0.3s'
                    }
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      backgroundColor: 'rgba(0, 0, 0, 0.01)'
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom fontWeight="medium" sx={{ mt: 2, mb: 1 }}>
                  Impact & Benefits
                </Typography>
                <TextField
                  fullWidth
                  id="benefits"
                  name="benefits"
                  label="Expected Benefits"
                  placeholder="How will this idea benefit the organization? (e.g., cost savings, efficiency, user experience)"
                  multiline
                  rows={4}
                  value={formik.values.benefits}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.benefits && Boolean(formik.errors.benefits)}
                  helperText={
                    (formik.touched.benefits && formik.errors.benefits) ||
                    "Explain the potential impact and benefits of implementing your idea. Quantify benefits where possible."
                  }
                  variant="outlined"
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.2)'
                      },
                      transition: 'box-shadow 0.3s'
                    }
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      backgroundColor: 'rgba(0, 0, 0, 0.01)'
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                    border: '1px dashed rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.03)',
                      borderColor: theme.palette.primary.light
                    }
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                    Supporting Attachments (Optional)
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Add files to support your idea. Visuals, diagrams, or documents can help reviewers understand better.
                  </Typography>
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUpload />}
                    sx={{
                      mb: 2,
                      borderRadius: 6,
                      px: 3,
                      py: 1,
                      boxShadow: 2,
                      '&:hover': {
                        boxShadow: 4
                      }
                    }}
                  >
                    Upload Files
                    <input
                      type="file"
                      multiple
                      hidden
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      accept={ALLOWED_FILE_TYPES.join(',')}
                    />
                  </Button>
                {fileError && (
                  <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFileError(null)}>
                    {fileError}
                  </Alert>
                )}
                {attachments.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 2 }}>
                        Attached Files ({attachments.length})
                      </Typography>
                      <Grid container spacing={2}>
                        {attachments.map((file, index) => {
                          // Determine which icon to use based on the preview value
                          let FileIcon = AttachFile;
                          if (file.preview === 'pdf-icon') FileIcon = PictureAsPdf;
                          else if (file.preview === 'doc-icon') FileIcon = Description;
                          else if (file.preview === 'sheet-icon') FileIcon = TableChart;
                          else if (file.preview === 'presentation-icon') FileIcon = Slideshow;
                          else if (file.preview === 'text-icon') FileIcon = Article;
                          else if (file.preview === 'generic-icon') FileIcon = InsertDriveFile;

                          return (
                            <Grid item xs={6} sm={4} md={3} key={file.id || index}>
                              <Card
                                elevation={2}
                                sx={{
                                  borderRadius: 2,
                                  overflow: 'hidden',
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                                  }
                                }}
                              >
                                <Box
                                  sx={{
                                    height: 120,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: 'rgba(0,0,0,0.04)',
                                    position: 'relative'
                                  }}
                                >
                                  {typeof file.preview === 'string' && file.preview.startsWith('blob:') ? (
                                    <img
                                      src={file.preview}
                                      alt={file.name}
                                      style={{
                                        maxHeight: '100%',
                                        maxWidth: '100%',
                                        objectFit: 'contain'
                                      }}
                                    />
                                  ) : (
                                    <FileIcon
                                      sx={{
                                        fontSize: 50,
                                        color: theme.palette.primary.main,
                                        opacity: 0.8
                                      }}
                                    />
                                  )}
                                  <IconButton
                                    size="small"
                                    onClick={() => handleRemoveFile(index)}
                                    sx={{
                                      position: 'absolute',
                                      top: 8,
                                      right: 8,
                                      bgcolor: 'rgba(255,255,255,0.9)',
                                      '&:hover': {
                                        bgcolor: 'rgba(255,255,255,1)'
                                      }
                                    }}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Box>
                                <Box sx={{ p: 1 }}>
                                  <Typography
                                    variant="body2"
                                    noWrap
                                    title={file.name}
                                    sx={{ fontWeight: 'medium' }}
                                  >
                                    {file.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {`${(file.size / 1024).toFixed(1)} KB`}
                                  </Typography>
                                </Box>
                              </Card>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Box>
                  </motion.div>
                )}
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Supported file types: Images, PDFs, Office documents, Text files (Max 5MB per file)
                  </Typography>
                </Box>
              </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => {
                      formik.resetForm();
                      setAttachments([]);
                    }}
                    disabled={isSubmitting}
                    sx={{
                      borderRadius: 8,
                      px: 4,
                      py: 1.2,
                      textTransform: 'none',
                      fontWeight: 'bold'
                    }}
                  >
                    Clear Form
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : undefined}
                    sx={{
                      borderRadius: 8,
                      px: 6,
                      py: 1.2,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      boxShadow: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        boxShadow: 6
                      },
                      '&::after': isSubmitting ? {} : {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
                        animation: 'ripple 2s infinite',
                      },
                      '@keyframes ripple': {
                        '0%': { transform: 'translateX(-100%)' },
                        '100%': { transform: 'translateX(100%)' }
                      }
                    }}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Your Idea'}
                  </Button>
                </Box>
              </Grid>

              {/* Stepper Navigation */}
              <Grid item xs={12}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 6,
                  pt: 2,
                  borderTop: '1px solid rgba(0,0,0,0.08)'
                }}>
                  {/* Back Button */}
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={handleBack}
                    disabled={activeStep === 0 || isSubmitting}
                    startIcon={<ArrowBack />}
                    sx={{
                      borderRadius: 8,
                      px: 3,
                      py: 1,
                      visibility: activeStep === 0 ? 'hidden' : 'visible',
                      textTransform: 'none'
                    }}
                  >
                    Back
                  </Button>

                  {/* Progress Indicator */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {steps.map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          mx: 0.5,
                          bgcolor: index === activeStep ? theme.palette.primary.main : 'rgba(0,0,0,0.1)',
                          transition: 'all 0.3s'
                        }}
                      />
                    ))}
                  </Box>

                  {/* Next/Submit Button */}
                  <Box>
                    {activeStep === steps.length - 1 ? (
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
                        sx={{
                          borderRadius: 8,
                          px: 4,
                          py: 1,
                          textTransform: 'none',
                          fontWeight: 'bold',
                          boxShadow: 3,
                          '&:hover': {
                            boxShadow: 6
                          }
                        }}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Idea'}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="contained"
                        onClick={handleNext}
                        endIcon={<ArrowForward />}
                        disabled={isSubmitting}
                        sx={{
                          borderRadius: 8,
                          px: 4,
                          py: 1,
                          textTransform: 'none',
                          fontWeight: 'bold',
                          boxShadow: 2,
                          '&:hover': {
                            boxShadow: 4
                          }
                        }}
                      >
                        Continue
                      </Button>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
                  )}
                </Box>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </Container>

      <Snackbar 
        open={Boolean(successMessage)} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default IdeaSubmission;