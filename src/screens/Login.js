import React from 'react';
import * as firebase from 'firebase/app';
import "firebase/auth";
import { ResponsiveImage, ResponsiveImageSize } from 'react-responsive-image';

const large = 'https://i.postimg.cc/Hk2dqWyJ/enhuff.png';

const App = (props) => {

    const login = () => {
        firebase.auth().signInAnonymously().then((result) => {

        })
        .catch(function(error) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // ...
          });
    }

    return (
        <div className='main'>
            <div className='kendo-image'>
              <ResponsiveImage>
                <ResponsiveImageSize
                  minWidth={0}
                  path={large}
                />
                <ResponsiveImageSize
                  minWidth={415}
                  path={large}
                />
                <ResponsiveImageSize
                  minWidth={1000}
                  path={large}
                />
              </ResponsiveImage>
              </div>
              <div className='kendo-details'>
                <input type="submit" value="Log in" onClick={(e) => login()} />
                <br /><br />
                Welcome to enhuff.com<p>
                This site is dedicated to the people that feel they've been stripped of their freedom due to politics.
                A fake crisis has been manufactured recently to deny us our income, make us wear masks, and force us into our homes.</p>
                If you feel that the response to Conronavirus is way worse than the disease itself, you're in the right place.<br />
                <strong style={{color:'blue'}}>Joining enhuff.com will allow you to find local, like-minded people to chat, or even organize, with.</strong><br /><br />
                The tyrants issuing these edicts have not only stripped us of our Constitutional rights but our health as well. A recent article 
                (<a style={{fontWeight:600}} target="_blank" href="https://www.nbcnews.com/think/opinion/covid-19-losses-uncertainty-have-led-mental-health-crisis-here-ncna1235547">see article</a>) 
                notes that depression has skyrocketed from 6.6% last year, to 30% this year. Anxiety disorders have skyrocketed from 8.2% last year, 
                to 36% this year. Reasons given for this include: isolation, loss of income or job security, lack of exercise, poor diet, and fear of getting Conronavirus.
                <blockquote><i>None of the symptoms of depression, mind you, seem to come directly from having Coronavirus or caring for someone who has it.</i></blockquote>
                From the day we're born we roll the dice. Some risks, like getting sick, are inherent in living, while other risks, like driving cars or flying on airplanes, 
                we assume because the inconvenience of not doing them outweigh the risks.<br /><br />
                You've weighed your risks, and you've chosen life.<br /><br />
                Thanks for reading
              </div>
          </div>
      );
}

export default App;