import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders homepage and header", () => {
  render(<App />);
  const linkElement = screen.getByText(/\[ INSIDE \] University/i);
  expect(linkElement).toBeInTheDocument();
});
