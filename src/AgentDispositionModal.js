import React from 'react';
import * as Flex from '@twilio/flex-ui';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import Dispositions from './dispositions.json';

const parent_dispositions = [];

var child_dispositions = [{ value: 0, label: '' }];

for (var key in Dispositions) {
    var temp = { value: key, label: key};
    parent_dispositions.push(temp);
}

export default class AgentDispositionModal extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.showForm = this.showForm.bind(this);
    this.cancelForm = this.cancelForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleDispositionChange = this.handleDispositionChange.bind(this);
    this.handleChildDispositionChange = this.handleChildDispositionChange.bind(this);
    this.state = {
      open: false,
      disposition: '',
      child_disposition: '',
      disableSubmit: 'true'
    };
  }

  componentDidMount() {
    window.addEventListener('agentDispositionModalOpen', (e) => {
      this.showForm();
    }, false)
  }

  showForm() {
    this.setState({ open: true });
  }

  cancelForm() {
    this.setState({ open: false });
    var event = new Event('agentDispositionCanceled');
    window.dispatchEvent(event);
  }

  submitForm() {
    this.setState({ open: false });
    var event = new CustomEvent('agentDispositionSuccessful', { detail: { disposition: this.state.disposition + ' - ' + this.state.child_disposition }});
    window.dispatchEvent(event);
  }

  handleDispositionChange(event) {

    var tempArray = Dispositions[event.target.value];

    child_dispositions = [];

    for (var key in tempArray) {
      var temp = { value: tempArray[key], label: tempArray[key]};
      child_dispositions.push(temp);
    }

    this.setState({ [event.target.name]: event.target.value });
  };

  handleChildDispositionChange(event) {
    // child_dispositions

    this.setState({ [event.target.name]: event.target.value });
    this.setState({ disableSubmit: false });
  };

  render() {

    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.cancelForm}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">What was this conversation about?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              If the conversation was about multiple topics, which single topic best describes it?
            </DialogContentText>
            <Select
              value={this.state.disposition}
              onChange={this.handleDispositionChange}
              name="disposition"
              style={{
                'marginTop': '20px'
              }}
            >
            {parent_dispositions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
            </Select>
            <br />
            <Select
              onChange={this.handleChildDispositionChange}
              value={this.state.child_disposition}
              name="child_disposition"
              style={{
                'marginTop': '20px'
              }}
            >
            {child_dispositions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
            </Select>
          </DialogContent>
          <DialogActions style={{
            margin: '0',
            padding: '8px 4px'
          }}>
            <Flex.Button onClick={this.submitForm} disabled={this.state.disableSubmit}>
              Submit
            </Flex.Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}