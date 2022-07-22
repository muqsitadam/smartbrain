import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particle from './components/Particles/Particles';
import Clarifai from 'clarifai';
import './App.css';


const apps = new Clarifai.App({
  apiKey: 'b724e725d3674691b496eef8f4858d1f'
})

const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: 'signIn',
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: ''
  } 
}

class App extends Component{
constructor(){
  super();
  this.state = initialState;
}

loadUser = (data) => {
  this.setState({
    user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    } 
  })
}

calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
  const image = document.getElementById('inputimage')
  const width = Number(image.width)
  const height = Number(image.height)
  return{
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.right_col * height),
  }
}

displayFaceBox = (box) => {
  this.setState({box: box})
}

onInputChange = (event) =>{
  this.setState({input: event.target.value})
}

onPictureSubmit= () => {

  this.setState({
    imageUrl: this.state.input
  })
  console.log('click')
  apps.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
    .then(response => {
      if(response){
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              id: this.state.user.id
          }) 
        })
        .then(response => response.json())
        .then(count => {
          //Note this... to update state without changing the whole user
          this.setState(Object.assign(this.state.user, {entries: count}))
        })
        .catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(response))})
      .catch(err => console.log(err))
} 

onRouteChange = (route) => {
  if(route === 'signOut'){
    this.setState(initialState)
  }else if(route === 'home'){
    this.setState({isSignedIn: true})
  }
  this.setState({route: route})
}

  render(){

    const { isSignedIn, imageUrl, route, box } = this.state;

    return(
      <div className="App">
        <Particle className="particles" />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        {route === 'home'
        ? <div>
            <Logo />
            <Rank
            name={this.state.user.name}
            entries={this.state.user.entries}
            />
            <ImageLinkForm 
              onInputChange={this.onInputChange}
              onPictureSubmit={this.onPictureSubmit} />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div> 
        : (route === 'signIn'
          ? <SignIn 
            loadUser={this.loadUser}
            onRouteChange = {this.onRouteChange} 
           />
          :<Register 
            loadUser={this.loadUser}
            onRouteChange = {this.onRouteChange} 
          /> 
          )
        }
      </div>
    );
  }
}
export default App;
