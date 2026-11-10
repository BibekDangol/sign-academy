import React, { Component } from 'react';
import useAxios from '../utils/useAxios';
import AuthContext from '../context/AuthContext';
import { Container, Grid, IconButton, Tooltip } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// ErrorBoundary component to catch and handle errors gracefully
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}

class App extends Component {
  static contextType = AuthContext;
  state = {
    image: null,
    imagePreviewUrl: null,
    imageData: [],
    isLoading: true,
    error: null,
    predefinedTitles: [
      'Title 1',
      'Title 2',
      'Title 3',
      'Title 4',
      'Title 5',
      'Title 6',
      'Title 7',
      'Title 8',
      'Title 9',
      'Title 10'
    ]
  };

  componentDidMount() {
    const user_id = this.context.user?.user_id;
    if (!user_id) return;

    this.props.api.get(`api/posts/?user_id=${user_id}`)
      .then(res => {
        this.setState({
          imageData: res.data,
          isLoading: false
        });
      })
      .catch(err => {
        this.setState({
          error: err.message,
          isLoading: false
        });
      });
  }

  handleImageChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        image: file,
        imagePreviewUrl: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  getRandomTitle = () => {
    const { predefinedTitles } = this.state;
    const randomIndex = Math.floor(Math.random() * predefinedTitles.length);
    return predefinedTitles[randomIndex];
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const user_id = this.context.user?.user_id;
    if (!user_id) return;

    const title = this.getRandomTitle();
    const content = `This is the content for ${title}`;
    let form_data = new FormData();
    form_data.append('image', this.state.image, this.state.image.name);
    form_data.append('title', title);
    form_data.append('content', content);
    form_data.append('user', user_id); // Add user ID obtained from JWT token
    let url = 'api/posts/';
    this.props.api.post(url, form_data)
      .then(res => {
        console.log(res.data);
        this.setState(prevState => ({
          imageData: [...prevState.imageData, res.data],
          imagePreviewUrl: null
        }));
      })
      .catch(err => console.log(err));
  };

  render() {
    const { imagePreviewUrl, imageData, isLoading, error } = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>Error: {error}</p>;
    }

    return (
      <ErrorBoundary>
        <Container maxWidth="sm">
          <Grid container spacing={2} justifyContent="center">
            {imageData.map((item, index) => (
              <Grid item xs={12} key={index} style={{ textAlign: 'center' }}>
                <Avatar className="h-[150px] w-[150px] mx-auto">
                  <AvatarImage src={item.image} alt={`Image ${index}`} className="object-cover" />
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
              </Grid>
            ))}
            <Grid item xs={120} style={{ textAlign: 'center'}}>
            UPLOAD / CHANGE PROFILE PICTURE<br />
              <div style={{ position: 'relative', width: 150, height: 150, borderRadius: '50%', overflow: 'hidden', backgroundColor: '#eee' , marginTop:"50px", marginLeft:"70px"}}>
                <Input
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' , paddingLeft:"400px"}}
                  accept="image/*"
                  id="icon-button-file"
                  type="file"
                  onChange={this.handleImageChange}
                />

                <Label htmlFor="icon-button-file" style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {imagePreviewUrl ? (
                    <Avatar className="h-full w-full">
                      <AvatarImage src={imagePreviewUrl} alt="Preview" className="object-cover" />
                    </Avatar>
                  ) : (
                    <center><CloudUploadIcon style={{ fontSize: 60, color: '#888' }} /></center>
                  )}
                </Label>
                {imagePreviewUrl && (
                  <Tooltip title="Submit">
                    <IconButton style={{ position: 'absolute', bottom: 5, right: 5, backgroundColor: 'white' }} onClick={this.handleSubmit}>
                      <CheckCircleIcon style={{ fontSize: 30, color: 'green' }} />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            </Grid>
          </Grid>
        </Container>
      </ErrorBoundary>
    );
  }
}

export default function Profile() {
  const api = useAxios();
  return <App api={api} />;
}
