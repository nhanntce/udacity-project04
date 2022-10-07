import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { putTodo } from '../api/todos-api'

enum UpdateTodoNameState {
  NoUpdate,
  Updating
}

interface EditTodoProps {
  match: {
    params: {
      todoId: string,
      currentName: string
    }
  }
  auth: Auth
}

interface EditTodoState {
  newTodoName: string
  updateState: UpdateTodoNameState
}

export class EditNameOfTodo extends React.PureComponent<
  EditTodoProps,
  EditTodoState
> {
  state: EditTodoState = {
    newTodoName: this.props.match.params.currentName,
    updateState: UpdateTodoNameState.NoUpdate
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoName: event.target.value })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.newTodoName.trim()) {
        alert('Todo\'s name should be entered');
        return
      }

      if (this.state.newTodoName === this.props.match.params.currentName) {
        alert('New todo\'s name is the same with the current todo\'s name');
        return
      }

      
      this.setUploadState(UpdateTodoNameState.Updating);
      const requestBody = {
        name: this.state.newTodoName
      }
      const uploadUrl = await putTodo(this.props.auth.getIdToken(), this.props.match.params.todoId, requestBody);

      alert('Todo\'s name was changed')
    } catch (e) {
      alert('Could not chnage todo\' name: ' + (e as Error).message)
    } finally {
      this.setUploadState(UpdateTodoNameState.NoUpdate)
    }
  }

  setUploadState(updateState: UpdateTodoNameState) {
    this.setState({
      updateState
    })
  }

  render() {
    return (
      <div>
        <h1>Upload Todo's name</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>File</label>
            <input
              type="text"
              value={this.state.newTodoName}
              placeholder="To change the world..."
              onChange={this.handleNameChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.updateState === UpdateTodoNameState.Updating && <p>Updating todo's name</p>}
        <Button
          loading={this.state.updateState !== UpdateTodoNameState.NoUpdate}
          type="submit"
        >
          Update
        </Button>
      </div>
    )
  }
}
