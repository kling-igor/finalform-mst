import React from "react";
import "./App.css";

import { Form, Field } from "react-final-form";
import { Config, FormApi, createForm } from "final-form";

import { types, Instance, flow, applySnapshot, destroy } from "mobx-state-tree";
import { observer } from "mobx-react";
import { v4 as uuidv4 } from "uuid";

const wait = async () => new Promise(resolve => setTimeout(resolve, 1000));

// модель сущности
const Wish = types.model("Wish", {
  id: types.identifier,
  name: types.optional(types.string, ""),
  comment: types.optional(types.string, ""),
});

// получение типа
interface IWish extends Instance<typeof Wish> {}

// stub для получения данных
function getWishes(): Promise<IWish[]> {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve([
        {
          id: uuidv4(),
          name: "PS5",
          comment: "Not used yet",
        },
        {
          id: uuidv4(),
          name: "Mac-mini",
          comment: "at least 2018",
        },
      ]);
    }, 2000)
  );
}

// хранилище списка сущностей
const WishStore = types
  .model("WishStore", {
    wishes: types.optional(types.array(Wish), []),
  })
  .actions((self) => ({
    fetch: flow(function* () {
      const wishes: IWish[] = yield getWishes();
      self.wishes.replace(wishes);
    }),
    addWish: flow(function*(wish: IWish) {
      // симуляция задержки сети
      yield wait()

      self.wishes.push(wish);
    }),
    removeById: flow(function*(id: string){
      // симуляция задержки сети
      yield wait()
      
      const wish = self.wishes.find(item => item.id === id);
      if (wish) {
        destroy(wish);
      }
    }),
    editWish: flow(function*(id:string, values:IWish){
      // симуляция задержки сети
      yield wait()
      
      const wish = self.wishes.find(item => item.id === id);
      if (wish) {
        applySnapshot(wish, values);
      }
    })
  }));

const store = WishStore.create({});

enum FieldNames {
  NAME = "name",
  COMMENT = "comment",
}
interface FormValue {
  [FieldNames.NAME]?: string;
  [FieldNames.COMMENT]?: string;
}

const initialValues: Config<FormValue>["initialValues"] = {
  [FieldNames.NAME]: "",
  [FieldNames.COMMENT]: "",
};

interface State {
  editableItemId?: string;
  initialLoading: boolean;
}

@observer
class App extends React.Component<{}, State> {
  state = {
    editableItemId: undefined,
    initialLoading: true
  };

  public readonly finalFormApi: FormApi<FormValue>;

  constructor(props: {}) {
    super(props);

    this.finalFormApi = createForm({
      onSubmit: this.onSubmit,
      initialValues,
    });
  }

  componentDidMount() {
    store.fetch().finally(() => {
      this.setState({initialLoading:false})
    })
  }

  onSubmit: Config<FormValue>["onSubmit"] = async (values: FormValue, form: FormApi<FormValue>): Promise<any> => {
    // simulate network latency
    return new Promise((resolve) =>
      setTimeout(() => {
        if (this.state.editableItemId) {
          store.editWish(this.state.editableItemId!, values as IWish)
        }
        else {
          store.addWish({ ...values, id: uuidv4() } as IWish);

          // clear form after submission but preserving success status
          form.initialize({})
        }

        resolve(undefined)
      }, 1000)
    );
  };

  onReset = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.finalFormApi.reset();
  };

  onAddNew = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.finalFormApi.initialize({});
    this.setState({editableItemId:undefined})
  };

  onItemClick = (id: string) => {
    const item = store.wishes.find((item) => item.id === id);
    if (item) {
      this.finalFormApi.initialize(item);
      this.setState({
        editableItemId: id,
      });
    }
  };

  onItemRemoveClick = (id:string) => {
    store.removeById(id);
  }

  render() {
    return (
      <div className="App">
        <Form
          onSubmit={this.onSubmit}
          form={this.finalFormApi}
          render={({ handleSubmit, submitting, pristine }) => {
            return (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
                <Field
                  name={FieldNames.NAME}
                  render={({ input, meta }) => (
                    <div>
                      <label>Name</label>
                      <input {...input} placeholder="your wish name" disabled={submitting}/>
                      {meta.touched && meta.error && <span>{meta.error}</span>}
                    </div>
                  )}
                />
                <Field
                  name={FieldNames.COMMENT}
                  render={({ input, meta }) => (
                    <div>
                      <label>Comment</label>
                      <textarea {...input} placeholder="any optional comments" disabled={submitting}/>
                      {meta.touched && meta.error && <span>{meta.error}</span>}
                    </div>
                  )}
                />
                <div>
                  <button
                    type="submit"
                    disabled={submitting || pristine}
                    style={{ width: "6rem" }}
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={this.onReset}
                    disabled={submitting || pristine}
                    style={{ width: "6rem" }}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={this.onAddNew}
                    disabled={!this.state.editableItemId}
                    style={{ width: "6rem" }}
                  >
                    Add New
                  </button>
                </div>
                {this.state.initialLoading && <span style={{color:'blue'}}>loading...</span>}
                {submitting && <span style={{color:'blue'}}>submitting...</span>}
              </form>
            );
          }}
        />
        <div>
          {store.wishes.map((wish: IWish) => (
            <div style={{display:"flex", flexDirection:"row", justifyContent:"center"}}>
              <div key={wish.id} onClick={() => this.onItemClick(wish.id)} style={{cursor:'pointer', color: this.state.editableItemId === wish.id ? "blue" : "black"}}>
                {wish.name}
              </div>
              <div style={{color:"red", marginLeft: "1rem", cursor:"pointer"}} onClick={() => this.onItemRemoveClick(wish.id)}>
                [X]
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
