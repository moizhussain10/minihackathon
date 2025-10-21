import React from "react";
import { Button, Checkbox, Form, Input, Card, Typography } from "antd";
import { Link } from "react-router-dom";
const { Title, Text } = Typography;


const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const Loginform = ({ signinuser }) => (
  <div
    style={{
      minHeight: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

    }}
  >
    <Card
      bordered={false}
      style={{
        width: 400,
        borderRadius: "16px",
        boxShadow: "0 4px 25px rgba(0,0,0,0.1)",
        background: "#fff",
        padding: "30px 20px",
        border: "1px solid black"
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <Title level={3} style={{ marginBottom: "0" }}>
          Login
        </Title>
        <Text type="secondary">Join PitchCraft today 🚀</Text>
      </div>

      <Form
        name="signup"
        layout="vertical"
        onFinish={signinuser}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label={<span style={{ fontWeight: 600 }}>Email</span>}
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Enter a valid email!" },
          ]}
        >
          <Input
            size="large"
            placeholder="example@email.com"
            style={{
              borderRadius: "8px",
            }}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontWeight: 600 }}>Password</span>}
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password
            size="large"
            placeholder="••••••••"
            style={{
              borderRadius: "8px",
            }}
          />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: "8px" }}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item style={{ marginTop: "16px" }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            style={{
              borderRadius: "8px",
              background: "linear-gradient(90deg, #5563DE 0%, #74ABE2 100%)",
              fontWeight: 600,
              letterSpacing: "0.5px",
            }}
          >
            Login
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <Text type="secondary">
          don't have an acount?
          <Link to={"/"} style={{ color: "#5563DE", fontWeight: 500 }}>
            Signup
          </Link>
        </Text>
      </div>
    </Card>
  </div>
);

export default Loginform;
