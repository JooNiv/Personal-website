import ReCAPTCHA from 'react-google-recaptcha'
import { useState, useRef } from 'react';

const CommentForm = ({getComments, setNotification}) => {
    const environment = process.env.NODE_ENV
    var baseurl = "" 
    if (environment == "development"){
      baseurl = "http://localhost:8000"
    }

    const recaptcha = useRef();
    const commentFormRef = useRef()

    const [isVisible, setIsVisible] = useState(false);
    const [formData, setFormData] = useState({
        comment: '',
        name: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
    
      if (!isVisible) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        const captchaValue = recaptcha.current.getValue();
    
        if (!captchaValue) {
          setTimeout(() => {
            setNotification({type: '', message: ''})
          }, 5000);
          setNotification({type: 'warning', message: "Please verify the reCAPTCHA!"})
          //alert('Please verify the reCAPTCHA!');

        } else {
          try {
            // Verify the captcha and submit the form in a single step
            const response = await fetch(`${baseurl}/api/post-comment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ ...formData, captchaValue }),
            });
    
            const result = await response.json();
    
            if (result.error) {
              setTimeout(() => {
                setNotification({type: '', message: ''})
              }, 5000);
              setNotification({type: 'error', message: "reCAPTCHA validation failed!"})
              //alert('reCAPTCHA validation failed!');
              recaptcha.current.reset();
            } else {
              // Handle successful form submission
              if (result.id) {  // Assuming the response contains the comment ID or some other indicator of success
                getComments();
                commentFormRef.current.click();
                setFormData({
                  comment: '',
                  name: '',
                });
                recaptcha.current.reset();
                setTimeout(() => {
                  setNotification({type: '', message: ''})
                }, 5000);
                setNotification({type: 'success', message: "Comment posted successfully."})
                
              } else {
                setTimeout(() => {
                  setNotification({type: '', message: ''})
                }, 5000);
                setNotification({type: 'error', message: "Error submitting form, please try again."});

                //alert('Error submitting form, please try again.');
              }
            }
          } catch (error) {
            console.error('Error submitting form:', error);
            setTimeout(() => {
              setNotification({type: '', message: ''})
            }, 5000);
            setNotification({type: 'error', message: "An unexpected error occurred. Please try again later."})
            
            //alert('An unexpected error occurred. Please try again later.');
          }
        }
      }
    };
    

    return (
        <div id="comment" className='container mx-auto max-w-2xl flex justify-left flex-wrap'>
        <details className="collapse collapse-arrow bg-base-200">
          <summary ref={commentFormRef} className="collapse-title text-xl font-medium">Feel free to leave a comment</summary>
          <div className="collapse-content">
            <form className='w-full'>
              <div className="w-full h-fit">
                <div className="h-full">
                  <label htmlFor="comment" className="">
                    Comment
                  </label>
                  <div className="mt-2 w-full h-1/2">
                    <textarea
                      onChange={handleChange}
                      value={formData.comment}
                      placeholder='Feel free to leave a comment. Ten most recent comments are displayed here.'
                      name="comment"
                      rows={3}
                      className="p-3 block w-full h-full bg-base-100 rounded-md border-0 py-1.5 shadow-sm placeholder:text-gray ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-white-100 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <br></br>
              <div className="mt-0">
                <div className="">
                  <label htmlFor="name" className="">
                    First name
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={handleChange}
                      value={formData.name}
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="given-name"
                      className="p-3 block w-full h-full bg-base-100 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            <div style={{ visibility: isVisible ? 'visible' : 'hidden' }} className={isVisible ? '': 'hidden'}>
              <ReCAPTCHA className= {isVisible ? 'mt-6 w-fit': 'hidden'}  ref={recaptcha} sitekey={import.meta.env.VITE_SITE_KEY} />
            </div>
            <div className="mt-6 flex items-center justify-left gap-x-6">
              <button
              onClick={handleSubmit}
                type="submit"
                className="btn btn-primary">
                Send
              </button>
            </div>
          </form>
          </div>
        </details>
        </div>
    )
}

export default CommentForm