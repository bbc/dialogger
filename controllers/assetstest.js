exports.assets = function(req, res) {
  res.json([
      { name: 'test file uno.wav',
        status: 'transcribing' },
      { name: 'test file does.wav',
        status: 'processing' }
  ]);
};
