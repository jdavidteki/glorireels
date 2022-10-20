import React, { Component } from "react";
import Firebase from "../../firebase/firebase.js";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Multiselect from "multiselect-react-dropdown";
import FancyVideo from "react-videojs-fancybox";
import DatePicker from "react-datepicker";
import { Recorder } from "react-voice-recorder";
import validator from 'validator'
import emailjs from '@emailjs/browser'

import "./PurchaseReel.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-voice-recorder/dist/index.css";

class ConnectedPurchaseReel extends Component {
  constructor(props) {
    super(props);

    this.state = {
			selectedLevelOption: "",
			errorMsg: "",
			reelPurpose: "",
			reelDuration: "",
			reelSampleLink: "",
			igname: "",
			emailAddress: "",
			firstName: "",
			lastName: "",
			downloadURL: "",
      dueDateSelected: new Date(),

      audioDetails: {
        url: null,
        blob: null,
        chunks: null,
        duration: {
          h: null,
          m: null,
          s: null,
        },
      },

      purposeOptions: [
        { name: "Birthday", id: 1 },
        { name: "Wedding", id: 2 },
        { name: "Bridal Shower", id: 3 },
        { name: "Graduation", id: 4 },
        { name: "Gender Reveal", id: 5 },
      ],

      levelOptions: [
        { name: "Simple", id: 1 },
        { name: "Medium", id: 2 },
        { name: "Professional", id: 3 },
      ],

      durationOption: [
        { name: "30secs", id: 1 },
        { name: "1min", id: 2 },
        { name: "2mins", id: 3 },
      ],
    };
  }

  componentDidMount() {
		//
  }


  handleAudioStop(data) {
    this.setState({ audioDetails: data });
  }

  handleAudioUpload(orderID){
		if (this.state.audioDetails.chunks != null){
			let audioBlob = new Blob(this.state.audioDetails.chunks, {type: 'audio/mpeg'});

			Firebase.storage()
			.ref("audioFolder/")
			.child(orderID + ".mp3")
			.put(audioBlob)
			.then((url) => {
				this.setState({avatarOnFile: true });
			})
			.catch((error) => {
				this.setState({errorMsg: error.message})
			})
		}
  }

  handleRest() {
    const reset = {
      url: null,
      blob: null,
      chunks: null,
      duration: {
        h: null,
        m: null,
        s: null,
      },
    };
    this.setState({ audioDetails: reset });
  }

	placeOrder(){

		let errors = ""
		let audioRecorded = false

		//required fields
		if(this.state.firstName == ""){
			errors += " First name is empty \n"
		}

		if(this.state.lastName == ""){
			errors += " Last name is empty \n"
		}

		if(!validator.isEmail(this.state.emailAddress)){
			errors += " Email Address is invalid \n"
		}

		let orderId = (this.state.emailAddress + Date.now()).replace(/[^a-z0-9]/gi, '');
		if (this.state.audioDetails.chunks != null){
			audioRecorded = true
		}else{
			if(this.state.levelOptions == ""){
				errors += " You didn't select a level options preference \n"
			}

			if(this.state.reelPurpose == ""){
				errors += " You did not enter purpose of the reel \n"
			}

			if(this.state.reelDuration == ""){
				errors += " You did not enter duration of the reel \n"
			}
		}

		this.setState({errorMsg: errors})

		if (errors == "" ){

			let reel = {
				id: orderId,
				emailAddress: this.state.emailAddress,
				igname: this.state.igname,
				firstName: this.state.firstName,
				lastName: this.state.lastName,
				reelPurpose: this.state.reelPurpose,
				reelDuration: this.state.reelDuration,
				reelSampleLink: this.state.reelSampleLink,
				dueDateSelected: this.state.dueDateSelected.toString().substring(16),
				selectedLevelOption: this.state.selectedLevelOption,
			}

      if(audioRecorded){
        let audioURL = `https://firebasestorage.googleapis.com/v0/b/glorireels-d7606.appspot.com/o/audioFolder%2F${orderId}.mp3?alt=media&token=aec8b012-27b0-45e4-9044-204b2d76ce1f`
        reel.orderAudioURL = audioURL
				this.handleAudioUpload(orderId)
			}

			Firebase.createGloriReelOrder(reel)
			.then(() =>{
        this.sendEmail(orderId)

        setTimeout(() => {
          location.href = "orders/" + orderId
          // this.props.changePage("orders/" + orderId)
        }, 1000)

			})
		}

	}

  sendEmail(orderId){
    let message =  `
      We have received your order (${orderId}) and it is in the works

      In the meantime, relax, listen to some Burna Boy, and your video will be ready as soon as possible.

      You can follow the progress of your reel here: https://www.glorireels.com/orders/${orderId}
    `

    var templateParams = {
      to_name: this.state.firstName,
      from_name: 'glorireels',
      message: message,
      recipient_email: this.state.emailAddress,
      sender_email: "jesuyedd@gmail.com",
      order_id: orderId
    };

    emailjs.send('service_jdguftl', 'template_z19ojwr', templateParams, 'VSKnf4Vspvt3LgOiz')
    .then(function(response) {
      console.log('SUCCESS!', response.status, response.text);
    }, (error) => {
        this.setState({errorMsg: error.message})
    });
  }

  render() {
    return (
      <div className="PurchaseReel l-container">
        <h2>happy to assist you. please answer the questions below</h2>

        <div className="PurchaseReel-name PurchaseReel-eachSection">
          <h3>* First things first: what is your name?</h3>
          <TextField
            value={this.state.firstName}
            placeholder="First Name **"
            onChange={(e) => {
              this.setState({ firstName: e.target.value });
            }}
          />
					<TextField
            value={this.state.lastName}
            placeholder="Last Name **"
            onChange={(e) => {
              this.setState({ lastName: e.target.value });
            }}
          />
					<TextField
            value={this.state.emailAddress}
            placeholder="Email Address **"
            onChange={(e) => {
              this.setState({ emailAddress: e.target.value });
            }}
          />
					<TextField
            value={this.state.igname}
            placeholder="Instagram Username **"
            onChange={(e) => {
              this.setState({ igname: e.target.value });
            }}
          />
        </div>

        <div className="PurchaseReel-voiceNote PurchaseReel-eachSection">
          <h3>
            Leave us a voicenote with all the answers from the questions below
            so you don't have to answer the questions. Then hit pay and the
            bottom of this page
          </h3>

          <Recorder
            record={true}
            audioURL={this.state.audioDetails.url}
            showUIAudio
            handleAudioStop={(data) => this.handleAudioStop(data)}
            handleOnChange={(value) => this.handleOnChange(value, "firstname")}
            handleRest={() => this.handleRest()}
          />
        </div>

        <div className="PurchaseReel-levelOptions PurchaseReel-eachSection">
          <h3>* Select your pricing preference below</h3>
          <div className="PurchaseReel-levelOptionsGallery">
						<div className="PurchaseReel-galleryEntry">
              <FancyVideo
                source="https://firebasestorage.googleapis.com/v0/b/glorireels-d7606.appspot.com/o/76069BB5-1B1A-4DD1-97AE-E9E3AF51644E.mov?alt=media&token=b07efd3a-ffd9-49e0-b4ce-a1675edf04be"
                poster="https://firebasestorage.googleapis.com/v0/b/glorireels-d7606.appspot.com/o/images%2FScreen%20Shot%202022-10-18%20at%202.38.47%20PM.png?alt=media&token=1f64edde-6b4a-499e-8e93-83edb5d5f67b"
                id={"sintel3"}
                fitToView={true}
              />
              <div className="PurchaseReel-videoDescription">
                <h3>Professional: $30</h3> very easy, not too many transitions.
                straightforward. click image to watch
              </div>
            </div>
            <div className="PurchaseReel-galleryEntry">
              <FancyVideo
                source="https://firebasestorage.googleapis.com/v0/b/glorireels-d7606.appspot.com/o/5BE3401F-4B73-4CC9-BD8F-04391497EBA2.mov?alt=media&token=af86b262-f8d8-464d-a2f4-9c1fe1fb4e56"
                poster="https://firebasestorage.googleapis.com/v0/b/glorireels-d7606.appspot.com/o/images%2FScreen%20Shot%202022-10-18%20at%202.38.40%20PM.png?alt=media&token=d1dd7ca6-9d17-4c3e-9f71-410b41e3bf1d"
                id={"sintel2"}
                fitToView={true}
              />
              <div className="PurchaseReel-videoDescription">
                <h3>Medium: $15</h3> very easy, not too many transitions.
                straightforward. click image to watch
              </div>
            </div>
            <div className="PurchaseReel-galleryEntry">
              <FancyVideo
                source="https://firebasestorage.googleapis.com/v0/b/glorireels-d7606.appspot.com/o/466D8CFA-5B4B-41A2-967E-39C79E982A1B.mov?alt=media&token=7941c2d7-0312-4c98-b5fa-141ff9f90fdf"
                poster="https://firebasestorage.googleapis.com/v0/b/glorireels-d7606.appspot.com/o/images%2FScreen%20Shot%202022-10-18%20at%202.38.32%20PM.png?alt=media&token=914da812-2223-4425-b57c-d50faa2b1498"
                id={"sintel1"}
                fitToView={true}
                autoplay
              />
              <div className="PurchaseReel-videoDescription">
                <h3>Simple: $10</h3> very easy, not too many transitions.
                straightforward. click image to watch
              </div>
            </div>
          </div>
          <Multiselect
            options={this.state.levelOptions} // Options to display in the dropdown
            selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
            onSelect={(e) => this.setState({selectedLevelOption: e[0].name})} // Function will trigger on select event
            displayValue="name" // Property name to display in the dropdown options
            placeholder="click here to select pricing"
						selectionLimit="1"
          />
        </div>

        <div className="PurchaseReel-purposeOptions PurchaseReel-eachSection">
          <h3>* Select the purpose of this reel</h3>
          <Multiselect
            options={this.state.purposeOptions} // Options to display in the dropdown
            selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
            onSelect={(e) => this.setState({reelPurpose: e[0].name})} // Function will trigger on select event
            displayValue="name" // Property name to display in the dropdown options
            placeholder="click to select reel purpose"
          />
        </div>

        <div className="PurchaseReel-dueDateSelection PurchaseReel-eachSection">
          <h3>* Select due date</h3>
          <DatePicker
            selected={this.state.dueDateSelected}
            onSelect={(e) => this.setState({dueDateSelected: e})} //when day is clicked
            onChange={(e) => this.setState({dueDateSelected: e})} //only when value has changed
          />
        </div>

        <div className="PurchaseReel-duration PurchaseReel-eachSection">
          <h3>* How long do you want your reel to be?</h3>
          <Multiselect
            options={this.state.durationOption} // Options to display in the dropdown
            selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
            onSelect={(e) => this.setState({reelDuration: e[0].name})} // Function will trigger on select event
            displayValue="name" // Property name to display in the dropdown options
            placeholder="Select Duration"
						selectionLimit="1"
          />
        </div>

        <div className="PurchaseReel-sampleVideo PurchaseReel-eachSection">
          <h3>* Is there a sample video or reel Gloria can look at?</h3>
          <TextField
            value={this.state.reelSampleLink}
            placeholder="link to sample reel"
            onChange={(e) => {
              this.setState({ reelSampleLink: e.target.value });
            }}
          />
        </div>

				<div className="PurchaseReel-placeOrder PurchaseReel-eachSection">
					{this.state.errorMsg &&
						<pre>Error(s): <br></br>{this.state.errorMsg}</pre>
					}

					<Button
						variant="contained"
						style={{backgroundColor: '#6848d8', color: 'white', marginTop: 32, marginBottom: 16}}
						onClick={() => this.placeOrder()}
					>
						Place Order
					</Button>
				</div>

				{/* <div className="PurchaseReel-stripePayment PurchaseReel-eachSection">
					<CardForm/>
				</div> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

let PurchaseReel = withRouter(connect(mapStateToProps)(ConnectedPurchaseReel));
export default withRouter(PurchaseReel);
