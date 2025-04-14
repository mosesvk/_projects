// src/components/header/FirmInfo.jsx
import { LineXlIcon } from '../ui/SvgIcons';

function FirmInfo({ firmName = "Client Firm Name", peerGroupSize = "XX" }) { // Use props later
  return (
    <div className="flex flex-row items-center fixed mt-8 left-1/2 -translate-y-1/2 -translate-x-1/2">
      <h1 className="text-2xl font-bold leading-snug tracking-wide" id="firmName">
        {firmName}
      </h1>
      <LineXlIcon />
      <p className="font-bold">
        Peer group size - <span id="uniqueClients">{peerGroupSize}</span>
      </p>
    </div>
  );
}

export default FirmInfo;