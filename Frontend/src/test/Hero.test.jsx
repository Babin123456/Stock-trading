import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, test, expect } from "vitest";
import Hero from "../LandingPage/Home/Hero.jsx";

//test suite(collection of test cases)//often pronounce as sweet 
//can run mutiple test cases at once

describe("Hero component", () => {
    test("renders hero image", () => {
        render(<Hero />);
        const heroImage = screen.getByAltText("Hero Image");
        expect(heroImage).toBeInTheDocument();
        expect(heroImage).toHaveAttribute("src", "/media/homeHero.png");
    });
    test("renders signUp Button", () => {
        render(<Hero />);
        const signUpButton = screen.getByRole("button", { name: "/Signup Now/" });
        expect(signUpButton).toBeInTheDocument();
        expect(signUpButton).toHaveClass("btn-primary");
    });
})
