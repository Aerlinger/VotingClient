import React from 'react';

export default React.createClass({
  getPair:     function() {
    return this.props.pair || [];
  },
  isDisabled:  function() {
    return !!this.props.hasVoted;
  },
  hasVotedFor: function(entry) {
    return this.props.hasVoted === entry;
  },
  render:      function() {
    return <div className="voting">
      {
        /* 1. The user clicks a vote button. A VOTE action is dispatched. */
        this.getPair().map(entry =>
          <button key={entry}
                  disabled={this.isDisabled()}
                  onClick={() => this.props.vote(entry)}>
            <h1>{entry}</h1>
            {this.hasVotedFor(entry) ?
              <div className="label">Voted</div> :
              null}
          </button>
        )
      }
    </div>;
  }
});