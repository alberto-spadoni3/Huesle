import React from "react";
import { Form } from "react-bootstrap";

const Settings = () => {
    return (
        <Form>
            <Form.Check type="switch" id="custom-switch" label="Check switch" />
        </Form>
    );
};

export default Settings;
