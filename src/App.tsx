import React from 'react';
import './App.css';

import { Form, Field } from 'react-final-form'
import { Config, FormApi, createForm } from "final-form";

import { types, Instance, flow } from "mobx-state-tree";
import { observer } from "mobx-react";
import { v4 as uuidv4 } from 'uuid';



const Wish = types.model("Wish", {
  id: types.identifier,
  name: types.optional(types.string, ""),
  comment: types.optional(types.string, "")
})

interface IWish extends Instance<typeof Wish> { }


const mock: IWish[] = [
  {
    id: uuidv4(),
    name: 'PS5',
    comment: 'New, not in use'
  },
  {
    id: uuidv4(),
    name: 'Mac-mini',
    comment: 'at least 2017'
  }
]

function getWishes(): Promise<IWish[]> {
  return new Promise(resolve => setTimeout(() => {
    resolve(mock);
  }, 2000))
}

const WishStore = types.model("WishStore", {
  wishes: types.array(Wish)
})
  .actions(self => ({
    fetch: flow(function* () {
      const wishes: IWish[] = yield getWishes();
      self.wishes.replace(wishes);
    })
  }))

// https://final-form.org/docs/react-final-form/examples


const store = WishStore.create({ wishes: [] })

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

@observer
class App extends React.Component<{}> {

  public readonly finalFormApi: FormApi<FormValue>;

  constructor(props: {}) {
    super(props);

    this.finalFormApi = createForm({
      onSubmit: this.onSubmit,
      initialValues
    })
  }

  componentDidMount() {
    store.fetch();
  }

  onSubmit: Config<FormValue>["onSubmit"] = async (values: FormValue): Promise<any> => {
    console.log(values)
    return new Promise(resolve => setTimeout(resolve, 1000))
  }

  render() {
    return (
      <div className="App">
        <Form
          onSubmit={this.onSubmit}
          form={this.finalFormApi}
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
        <div>
          {store.wishes.map((wish: IWish) => (<div key={wish.id} >{wish.name}</div>))}
        </div>
      </div >
    );
  }
}

export default App;
