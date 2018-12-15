"use strict";
//import { h, render } from "preact"; // TypeScript (currently, 2.8) can't emit a proper import statement for es6 including the .js suffix and the ./ prefix, so reference it by <reference/> instead and import using the html page
/// <reference types="preact"/>
class Setting extends preact.Component {
    constructor() {
        super(...arguments);
        this.onStorageChanged = this.onStorageChanged.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        browser.storage.onChanged.addListener(this.onStorageChanged);
        browser.storage.local.get(this.props.setting.key).then(value => this.setState({ value: value[this.props.setting.key] }));
    }
    componentWillUnmount() {
        browser.storage.onChanged.removeListener(this.onStorageChanged);
    }
    onStorageChanged(changes, areaName) {
        if (areaName === "local") {
            const change = changes[this.props.setting.key];
            if (change) {
                this.setState({ value: change.newValue });
            }
        }
    }
    handleChange(newValue) {
        browser.storage.local.set({ [this.props.setting.key]: newValue });
    }
    render(props, state) {
        return preact.h("div", { class: "setting" },
            preact.h("div", { class: "settinglabel" },
                preact.h("label", { for: props.setting.key }, props.setting.title),
                preact.h("div", { class: "detail" }, props.setting.description)),
            this.getInputElement(props.setting.key, state.value));
    }
}
class Checkbox extends Setting {
    getInputElement(id, value) {
        return preact.h("input", { type: "checkbox", id: id, checked: value, onChange: e => this.handleChange(e.target.checked) });
    }
}
class Textbox extends Setting {
    getInputElement(id, value) {
        return preact.h("input", { type: "text", id: id, value: value, onChange: e => this.handleChange(e.target.value) });
    }
}
class Numberbox extends Setting {
    getInputElement(id, value) {
        return preact.h("input", { type: "number", id: id, value: value, onChange: e => this.handleChange(e.target.valueAsNumber) });
    }
}
class Menulist extends Setting {
    getInputElement(id, value) {
        return preact.h("select", { id: "{id}", onChange: e => this.handleChange(e.target.value) },
            " ",
            this.props.setting.optionValues.map(optionValue => preact.h("option", { value: optionValue.value, selected: optionValue.value === value }, optionValue.label)));
    }
}
class RadioButtonGroup extends Setting {
    getInputElement(id, value) {
        return preact.h("div", { class: "radiobuttongroup", onChange: e => this.handleChange(e.target.value) },
            " ",
            this.props.setting.optionValues.map((optionValue, index) => {
                const optionId = id + index.toString();
                return preact.h("div", null,
                    preact.h("input", { type: "radio", id: optionId, name: id, value: optionValue.value, checked: optionValue.value === value }),
                    " ",
                    preact.h("label", { for: optionId }, optionValue.label));
            }));
    }
}
class Button extends Setting {
    componentDidMount() { }
    componentWillUnmount() { }
    getInputElement(id, value) {
        return preact.h("button", { id: id, type: "button", onClick: () => browser.runtime.sendMessage(this.props.setting.key) }, this.props.setting.text);
    }
}
const settingComponents = {
    "boolean": Checkbox,
    "string": Textbox,
    "integer": Numberbox,
    "menulist": Menulist,
    "radiobuttons": RadioButtonGroup,
    "button": Button,
};
class Settings extends preact.Component {
    render(props) {
        return preact.h("form", null, props.settings.map(setting => {
            const SettingComponent = settingComponents[setting.type];
            return preact.h(SettingComponent, { setting: setting, key: setting.key });
        }));
    }
}
preact.render(preact.h(Settings, { settings: optionsConfig }), document.getElementById("root"));
