const HIGH_BANDWIDTH_CONCURRENCY_THRESHOLD = 2000;

function packageConcurrency(item) {
  const candidates = [
    item?.details?.amount,
    item?.details?.total,
    item?.total,
    item?.amount,
    item?.concurrency,
    item?.conns
  ];

  for (const candidate of candidates) {
    const value = Number(candidate);
    if (Number.isFinite(value)) return value;
  }
  return 0;
}

function isConcurrencyPackage(item) {
  return item?.chargeType === "tunnelIp" || Number(item?.chargeType) === 18;
}

function isHighBandwidthPackage(item) {
  return isConcurrencyPackage(item)
    && packageConcurrency(item) >= HIGH_BANDWIDTH_CONCURRENCY_THRESHOLD;
}

export {
  HIGH_BANDWIDTH_CONCURRENCY_THRESHOLD,
  isConcurrencyPackage,
  isHighBandwidthPackage,
  packageConcurrency
};
