import React from 'react';
import './App.css';

import { Form, Field } from 'react-final-form'

class App extends React.Component {

  onSubmit = (values: any) => {
    console.log(values)
  }

  render() {
    return (
      <div className="App">
        <Form
          onSubmit={this.onSubmit}
          // validate={validate}
          render={({ handleSubmit, submitting, pristine, form }) => (
            <form onSubmit={handleSubmit}>
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
              <button type="submit" disabled={submitting || pristine}>
                Submit
              </button>
              <button
                type="button"
                onClick={form.reset}
                disabled={submitting || pristine}
              >
                Reset
              </button>
            </form>
          )}
        />
      </div>
    );
  }
}

export default App;
