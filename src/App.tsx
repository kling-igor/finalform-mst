import React from 'react';
import './App.css';

import { Form, Field } from 'react-final-form'
import { Config } from "final-form";

enum FieldNames {
  NAME = 'name',
  COMMENT = 'comment'
}

interface FormValue {
  [FieldNames.NAME]?: string;
  [FieldNames.COMMENT]?: string;
}

const initialValues: Config<FormValue>["initialValues"] = {
  [FieldNames.NAME]: 'initial name',
  [FieldNames.COMMENT]: 'initial comment'
}

class App extends React.Component {

  onSubmit: Config<FormValue>["onSubmit"] = async (values: FormValue): Promise<any> => {
    console.log(values)
    return new Promise(resolve => setTimeout(resolve, 1000))
  }

  render() {
    return (
      <div className="App">
        <Form
          onSubmit={this.onSubmit}
          initialValues={initialValues}
          render={({ handleSubmit, submitting, pristine, form }) => (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
              <Field
                name={FieldNames.NAME}
                render={({ input, meta }) => (
                  <div>
                    <label>Name</label>
                    <input {...input} />
                    {meta.touched && meta.error && <span>{meta.error}</span>}
                  </div>
                )}
              />
              <Field
                name={FieldNames.COMMENT}
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
                  onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => form.reset()}
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
