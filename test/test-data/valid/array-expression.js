const data = {
    createSettingsData(fuelSettingRaw, orderSettingsRaw) {
        let fuelSetting = _.cloneDeep(fuelSettingRaw);
        let orderSettings = _.cloneDeep(orderSettingsRaw);
        // TRULY-POSITIVE
        //const resultSettings = [];
        // division
        orderSettings = _.filter(orderSettings, (sett) => sett.nDivID === fuelSetting.nDivID);

        // DIV
        let result = internal.getConclusiveCostTypes(orderSettings);
        if (result) {
            fuelSetting.aPercentCostTypes = result;
            return [fuelSetting];
        }
    }
}