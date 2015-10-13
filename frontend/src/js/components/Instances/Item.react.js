import { instancesStore } from "../../stores/Stores"
import React, { PropTypes } from "react"
import moment from "moment"
import { Label } from "react-bootstrap"
import StatusHistoryContainer from "./StatusHistoryContainer.react"

class Item extends React.Component {

  constructor(props) {
    super(props)
    this.state = {status: {}, loading: false, statusHistory: {}}
    this.fetchStatusFromStore = this.fetchStatusFromStore.bind(this)
    this.onToggle = this.onToggle.bind(this)
    this.fetchStatusHistoryFromStore = this.fetchStatusHistoryFromStore.bind(this)  
  }

  static PropTypes: {
    instance: React.PropTypes.object.isRequired,
    key: React.PropTypes.number.isRequired,
    selected: React.PropTypes.bool,
    versionNumbers: React.PropTypes.array,
    styles: React.PropTypes.array
  }

  fetchStatusFromStore() {
    let status = instancesStore.getInstanceStatus(this.props.instance.application.status, this.props.instance.application.version)
    this.setState({status: status})
  }

  fetchStatusHistoryFromStore() {
    let appID = this.props.instance.application.application_id,
        groupID = this.props.instance.application.group_id,
        instanceID = this.props.instance.id

    if (!this.props.selected) {
      instancesStore.getInstanceStatusHistory(appID, groupID, instanceID).
        done(() => { 
          this.props.onToggle(this.props.instance.id, !this.props.selected)
        })
    } else {
      this.props.onToggle(this.props.instance.id, !this.props.selected)      
    }

  }

  componentDidMount() {
    this.fetchStatusFromStore()
  }

  onToggle() {
    this.fetchStatusHistoryFromStore()
  }

  render() {
    let date = moment.utc(this.props.instance.application.last_check_for_updates + "+00:00").local().format("DD/MM/YYYY, hh:mma"),
        active = this.props.selected ? " active" : "",
        index = this.props.versionNumbers.indexOf(this.props.instance.application.version),
        boxStyle = "default"
    
    if (index >= 0 && index < this.props.styles.length) {
      boxStyle = this.props.styles[index]
    }

    let downloadingIcon = this.state.status.spinning ? <img src="img/mini_loading.gif" /> : "",
        statusIcon = this.state.status.icon ? <i className={this.state.status.icon}></i> : "",
        instanceLabel = this.state.status.className ? <Label>{statusIcon} {downloadingIcon} {this.state.status.description}</Label> : <div>&nbsp;</div>

    return(
      <div className="instance">
        <div className="coreRollerTable-body">
          <div className="coreRollerTable-cell lightText">
            <p onClick={this.onToggle} className="activeLink" id={"instanceDetails-" + this.props.key}>
              {this.props.instance.ip} 
              &nbsp;<i className="fa fa-caret-right"></i>
            </p>
          </div>
          <div className="coreRollerTable-cell coreRollerTable-cell--medium">
            <p>{this.props.instance.id}</p>
          </div>
          <div className="coreRollerTable-cell">
            {instanceLabel}
          </div>
          <div className="coreRollerTable-cell">
            <p className={"box--" + boxStyle}>{this.props.instance.application.version}</p>
          </div>
          <div className="coreRollerTable-cell">
            <p>{date}</p>
          </div>   
        </div>
        <StatusHistoryContainer active={active} instance={this.props.instance} key={this.props.instance.id} />
      </div>
    )
  }

}

export default Item