import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Acknowledgement(props) {

    const Navigate=useNavigate();
    async function sendMail(status) {
        console.log("Inside sendMail");
        console.log("Curr user " + props.curUser);
        const email = props.curUser;
        try {
            const res = await axios.post("http://localhost:3002/get_details", { email: email });
            console.log("First messsage" + res.data);
            try {
                const name = res.data.name;
                const email1 = res.data.email1;
                const email2 = res.data.email2;

                const res1 = await axios.post("http://localhost:3002/send_email", { name: name, email1: email1, email2: email2,status: status });
                console.log("second message" + res1.data);
            }
            catch (e) {
                console.log("Error inside second one ");
                console.log(e);
            }

        }
        catch (err) {
            console.log(err);
        }

    }
   async function handleClick()
   {
    sendMail("Revert");
    Navigate("/webcam");    
   }
    return (
        <div id="parent">
            <div className='outer-div-ack'>
                <div className="shadow bg-white-rounded inner-div-ack">
                    <p>
                        We have sent the mail to your family members. Soon, They will take some action.
                        If you think this alaram is false, Then press Revert button to inform your family members that you are safe.
                    </p>

                    <button className="btn btn-primary" onClick={handleClick}>Revert</button>
                </div>
            </div>
        </div>
    )
}

export default Acknowledgement