import React, { PropTypes } from 'react';
import CircularProgressbar from 'react-circular-progressbar';
import Utils from '../../utils';
import { STAT_NAMES, HUNDREDTHS_PLACE } from './Constants';

const getPctSlaveUsage = (slaves, slaveUsages, usageCallback, resourceCallback) => {
  const totalUsage = slaveUsages.map(usageCallback)
                                .reduce((acc, val) => acc + parseFloat(val), 0);

  const totalResource = slaves.map(resourceCallback)
                              .reduce((acc, val) => acc + parseFloat(val), 0);

  return Utils.roundTo((totalUsage / totalResource) * 100, HUNDREDTHS_PLACE);
};

const getCpuUtilizationPct = (slaves, slaveUsages) => {
  return getPctSlaveUsage(slaves,
                          slaveUsages,
                          usage => usage.cpusUsed,
                          slave => Utils.getMaxAvailableResource(slave, STAT_NAMES.cpusUsedStat));
};

const getMemUtilizationPct = (slaves, slaveUsages) => {
  return getPctSlaveUsage(slaves,
                          slaveUsages,
                          usage => usage.memoryBytesUsed,
                          slave => Utils.getMaxAvailableResource(slave, STAT_NAMES.memoryBytesUsedStat));
};

const SlaveAggregates = ({slaves, slaveUsages, activeTasks}) => {
  return (
    <div className="slave-aggregates row">
      <div className="aggregate col-xs-2">
        <div className="value">
          {slaves.length}
        </div>
        <div className="label">
          Active Slaves
        </div>
      </div>
      <div className="aggregate col-xs-2">
        <div className="value">
          {activeTasks}
        </div>
        <div className="label">
          Tasks Running
        </div>
      </div>
      <div className="aggregate graph col-xs-2">
        <CircularProgressbar percentage={getCpuUtilizationPct(slaves, slaveUsages)} initialAnimation={true} textForPercentage={(pct) => `${pct}%`} />
        <div className="label">
          Cpu
        </div>
      </div>
      <div className="aggregate graph col-xs-2">
        <CircularProgressbar percentage={getMemUtilizationPct(slaves, slaveUsages)} initialAnimation={true} textForPercentage={(pct) => `${pct}%`} />
        <div className="label">
          Memory
        </div>
      </div>
    </div>
  );
};

SlaveAggregates.propTypes = {
  slaves : PropTypes.array,
  slaveUsages : PropTypes.array,
  activeTasks : PropTypes.number.isRequired
};

export default SlaveAggregates;
