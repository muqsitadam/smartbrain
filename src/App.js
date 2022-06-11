import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particle from './components/Particles/Particles';
import Clarifai, { COLOR_MODEL } from 'clarifai';
import './App.css';


const apps = new Clarifai.App({
  apiKey: 'b724e725d3674691b496eef8f4858d1f'
})

class App extends Component{
constructor(){
  super();
  this.state = {
    input: "",
    imageUrl: "",
    box: {}
  }
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
  console.log(box)
  this.setState({box: box})
}

onInputChange = (event) =>{
  this.setState({input: event.target.value})
}

onButtonSubmit= () => {

  this.setState({
    imageUrl: this.state.input
  })
  console.log('click')
  apps.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err))
}

  render(){
    return(
      <div className="App">
        <Particle className="particles" />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit} />
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}
export default App;
