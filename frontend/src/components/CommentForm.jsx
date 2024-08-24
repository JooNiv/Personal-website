import ReCAPTCHA from 'react-google-recaptcha'
import { useState, useRef } from 'react';

const CommentForm = ({getComments}) => {

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
        event.preventDefault()
        if (!isVisible) {
          setIsVisible(true)
        }
        else {
          setIsVisible(false)
          const captchaValue = recaptcha.current.getValue()
          if (!captchaValue) {
            alert('Please verify the reCAPTCHA!')
          } else {
            const res = await fetch('/api/verify', {
              method: 'POST',
              body: JSON.stringify({ captchaValue }),
              headers: {
                'content-type': 'application/json',
              },
            })
            const data = await res.json()
            if (data.success) {
              // make form submission
              try {
                if (formData.name == '' || formData.comment == '') {
                  alert('Enter a comment and your name first.')
                }
                else {
                const response = await fetch('/api/post-comment', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(formData),
                });
                const result = await response.json();
                getComments()
                commentFormRef.current.click()
                setFormData({
                  comment: '',
                  name: '',
                })
                recaptcha.current.reset()
              }
              } catch (error) {
                console.error('Error submitting form:', error);
              }
            } else {
              alert('reCAPTCHA validation failed!')
            }
          }
        }
      }

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