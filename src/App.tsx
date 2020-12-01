import React from 'react';
import './App.css';

import { Form, Field } from 'react-final-form'

class App extends React.Component {

  onSubmit = async (values: any): Promise<any> => {
    console.log(values)

    return new Promise(resolve => setTimeout(resolve, 1000))
  }

  render() {
    return (
      <div className="App">
        <Form
          onSubmit={this.onSubmit}
          initialValues={{ name: 'initial name', comment: 'initial comment' }}
          render={({ handleSubmit, submitting, pristine, form }) => (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
              <Field
                name="name"
                render={({ input, meta }) => (
                  <div>
                    <label>Name</label>
                    <input {...input} />
                    {meta.touched && meta.error && <span>{meta.error}</span>}
                  </div>
                )}
              />
              <Field
                name="comment"
                render={({ input, meta }) => (
                  <div>
                    <label>Comment</label>
                    <textarea {...input} />
                    {meta.touched && meta.error && <span>{meta.error}</span>}
                  </div>
                )}
              />
              <div>
                <button type="submit" disabled={submitting || pristine} style={{ width: '8rem' }}>
                  Submit
                </button>
                <button
                  type="button"
                  onClick={form.reset}
                  disabled={submitting || pristine}
                  style={{ width: '8rem' }}
                >
                  Reset
                </button>
              </div>
              {submitting && <span>submitting...</span>}
            </form>
          )}
        />
      </div>
    );
  }
}

export default App;
