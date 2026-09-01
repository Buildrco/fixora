const { withGradleProperties } = require("@expo/config-plugins");

module.exports = function withAndroidArm64(config) {
  return withGradleProperties(config, (config) => {
    config.modResults = config.modResults
      .filter((property) => property.key !== "reactNativeArchitectures")
      .concat({
        type: "property",
        key: "reactNativeArchitectures",
        value: "arm64-v8a",
      });

    return config;
  });
};