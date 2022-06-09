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
    input: '',
  }
}

onInputChange = (event) =>{
  console.log(event.target.value)
}

onButtonSubmit= () => {
  console.log('click')
  apps.models.predict(
    Clarifai.COLOR_MODEL,
    "https://samples.clarifai.com/face-det.jpg")
    .then(
    function(response){
      console.log(response)
    },
    function(err){
      console.log(err)
    }
  )
}

  render(){
    return(
      <div className="App">
        <Particle />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit} />
        <FaceRecognition />
      </div>
    );
  }
}
export default App;
