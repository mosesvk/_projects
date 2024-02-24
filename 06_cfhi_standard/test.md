## Table of Contents

1. [Introduction to JavaScript](#introduction-to-javascript)
2. [Syntax and Basics](#syntax-and-basics)
3. [Variables and Values](#variables-and-values)
4. [Code Organization](#code-organization)
5. [DOM Manipulation](#dom-manipulation)
6. [Control Flow](#control-flow)
7. [Debugging Skills](#debugging-skills)
8. [Browser Security](#browser-security)

> <details>
> <summary>Resources</summary>
>
> - [MDN Web Docs - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
>   - MDN - Quick & accurate documentation site you should get used to
> - [MDN Web Docs - Ledarn JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps)
>   - Their educational materials
> - [W3Schools JavaScript Reference](https://www.w3schools.com/jsref/)
>   - More beginner-friendly -- but less comprehensive documentation site
> - [W3Schools JavaScript Examples](https://www.w3schools.com/js/js_examples.asp)
> - [javascript.info](https://javascript.info)
>   - Gold standard of JavaScript education
>
> </details>



## Introduction to JavaScript {#introduction-to-javascript}

<div style="text-align:center">
<img src="https://miro.medium.com/v2/resize:fit:1400/1*LyZcwuLWv2FArOumCxobpA.png" width="300" height="200" />
</div>

<details>
<summary>What is a Programming Language?</summary>

> A Programming Language is a **formal language that specifies a set of instructions.**
>
> A set of instructions create <u>computations, algorithms, applications</u>, etc.
>
> There are thousands different programming languages being used all around us.
>
> The most commonly used programming languages are Python, Java, JavaScript, C++, and C#. Programming languages are used to create websites, software, and applications, as well as to control machines and robots.

</details>

<details>
<summary>What is JavaScript?</summary>

> JavaScript (JS) is a  is a powerful programming language that can add interactivity to a website. It was invented by Brendan Eich.
>
> JavaScript is one of the **most popular modern web technologies!**. It is versatile and beginner-friendly. As your JavaScript skills grow, your websites will enter a new dimension of <u>power</u> and <u>creativity</u>. You'll be able to create games, animated 2D and 3D graphics, comprehensive database-driven apps, and much more!
>
><details>
><summary>Java vs. JavaScript, are they the same?</summary>
>
>> No, Java and JavaScript are different languages with different syntax, semantics, and use cases. Java is typically used for server-side development, while JavaScript is primarily used for client-side scripting in web browsers.
>
></details>
>
><details>
><summary>What can we do with JavaScript?</summary>
>
>> With JavaScript, you can create interactive web pages, handle user input, manipulate HTML and CSS, perform asynchronous operations like AJAX requests, and much more.
>
></details>
>
><details>
><summary>What can’t we do with JavaScript?</summary>
>
>> While JavaScript is powerful for client-side scripting, it cannot directly access the user's file system for security reasons. Additionally, it may not be suitable for CPU-intensive tasks or for developing standalone desktop applications.
>
></details>

</details>


<details>
<summary>Hello, World</summary>

><i>let's practice putting our first javascript code to the web</i>
>
> 1. Go to your test site and create a new folder named scripts. Within the scripts folder, create a new text document called main.js, and save it.
>
> 2. In your index.html file, enter this code on a new line, just before the closing </body> tag:
>
> ```html
> <script src="scripts/main.js"></script>
> ```
> 3. This is doing the same job as the <link> element for CSS. It applies the JavaScript to the page, so it can have an effect on the HTML (along with the CSS, and anything else on the page).
>
> 4. Add this code to the main.js file:
>
> ```javascript
> const myHeading = document.querySelector("h1");
> myHeading.textContent = "Hello world!";
> ```
> 5. Make sure the HTML and JavaScript files are saved. Then load index.html in your browser.
>
</details>

```javascript
const myHeading = document.querySelector("h1");
myHeading.textContent = "Hello world!";
 ```











<details>
<summary>Quiz</summary>
<details>
<summary></summary>
</details>

</details>





***



## Syntax and Basics {#syntax-and-basics}

- Learn the fundamental syntax and principles of JavaScript.

## Variables and Values {#variables-and-values}

- Create and manipulate variables and values in JavaScript.

## Code Organization {#code-organization}

- Write JavaScript code both inline and in external files.

## DOM Manipulation {#dom-manipulation}

- Utilize JavaScript to manipulate the Document Object Model (DOM) for dynamic web content.

## Control Flow {#control-flow}

- Implement basic logic and control flow using JavaScript's conditional statements and loops.

## Debugging Skills {#debugging-skills}

- Develop the ability to debug and troubleshoot JavaScript code effectively.

## Browser Security {#browser-security}

- Understand the importance of browser security and its implications on JavaScript usage.

## Key Terms

- Browsers
- Java
- JavaScript
- ECMAScript
- TC39

## Overview

JavaScript is a dynamic computer scripting programming language which is compiled at runtime. It is lightweight and most commonly used as a part of web pages, whose implementations allow client-side script to interact with the user and make dynamic pages. It is an interpreted programming language with object-oriented capabilities.

## Lesson Plan

### History of JavaScript

JavaScript is a scripting programming language. Some programmers have their reservations about JavaScript being a programming language, but that's ok. What I care about is how to program in this language. It is important to understand some history and the process that it takes for a new feature to be released as part of official language specification. Three terms Ecma, EcmaScript, and the TC39 to keep in mind.

In 1995, websites typically looked like Berkshire Hathaway (http://berkshirehathaway.com/) and back then this was an amazing thing to see. At this time, Netscape Navigator was the most popular web browser with close to 80% market share. The Netscape founder, Marc Andreessen envisioned a more dynamic platform with client side interactivity that was easy to use by designers and developers.

Brendan Eich was recruited by Netscape to embed the Scheme programming language into Netscape Navigator. However, before he could get started, Netscape had worked with Sun Microsystems to make a rising programming language Java available in the browser. Netscape wanted "a scripting language that was simple enough for coding amateurs to use" - sadly, Java wasn’t that. From there, the idea became that Java could be used by "professionals" and this new language “Mocha” (which was the initial name of JavaScript) would be used by amateurs. Because of this collaboration between languages, Netscape decided that Mocha needed to compliment Java and should have a relatively similar syntax.

History states that in just 10 days Brendan created the first version of Mocha. Eventually Mocha changed it's name to LiveScript then today we know to be JavaScript. Back then it was a marketing ploy to ride the hype of Java. JavaScript was then marketed as a scripting language for the browser - accessible to both amateurs while Java was the professional tool for building rich web components.

Microsoft was also working on Internet Explorer. Because JavaScript fundamentally changed the user experience of the web, if you were a competing browser, since there was no JavaScript specification, you had no choice but to come up with your own implementation. History showed, that it was exactly what Microsoft did and they called it JScript.

This lead to a problem, JScript filled the same use case as JavaScript, but its implementation was different. This meant that you couldn’t build one website and expect it to work on both Internet Explorer and Netscape Navigator. The two implementations were different that “Best viewed in Netscape” and “Best viewed in Internet Explorer” badges became common for most companies who couldn’t afford to build for both implementations. This is where Ecma comes into the picture.

Ecma International is “an industry association founded in 1961, dedicated to the standardization of information and communication systems”. In 1996, Netscape submitted JavaScript to Ecma to build out a standard specification. In doing so, it gave other contributors a voice in the evolution of the language and, ideally, it would help keep other implementations consistent across browsers.

Under Ecma, each new specification comes with a standard and a committee. In JavaScript’s case, the standard is ECMA-262 and the committee who works on the ECMA-262 standard is the TC39.

If you look up the ECMA262 standard, you’ll notice that the term “JavaScript” is never used. Instead, they use the term “EcmaScript” to talk about the official language. The reason for this is because Oracle owns the trademark for the term “JavaScript”. To avoid legal issues, Ecma decided to use the term EcmaScript instead. ECMAScript is usually used to refer to the official standard, ECMA-262, while JavaScript is used when talking about the language in practice.

The committee which oversees the evolution of the Ecma262 standard is the TC39, which stands for Technical Committee 39. The TC39 is made up of members who are typically browser vendors and large companies who’ve invested heavily in the web like Facebook and PayPal.

When a new proposal is created, that proposal has to go through certain stages before it becomes part of the official specification. It’s important to keep in mind that in order for any proposal to move from one stage to another, a consensus among the TC39 must be met. This means that a large majority must agree.

Each new proposal starts off at Stage 0. This stage is called the "Straw man" stage. Stage 0 proposals are proposals which are planned to be presented to the committee by a TC39 champion or, have been presented to the committee and not rejected definitively, but not yet achieved any of the criteria to get into stage 1. The only requirement for becoming Stage 0 proposal is that the document must be reviewed at a TC39 meeting.

The next stage is Stage 1. In order to progress to Stage 1, an official “champion” who is part of TC39 must be identified and is responsible for the proposal. In addition, the proposal needs to describe the problem it solves, have illustrative examples of usage, a high level API, and identify potential concerns and implementation challenges. By accepting a proposal for stage 1, the committee signals they’re willing to spend resources to look into the proposal in more depth.

The next stage is Stage 2. At this point, it’s more than likely that this feature will eventually become part of the official specification. In order to make it to stage 2, the proposal must, in formal language, have a description of the syntax and semantics of the new feature. This is the stage where all aspects of the feature is carefully reviewed and lock down. Future changes may still likely occur, but they should only be minor, incremental changes.

Next up is Stage 3. At this point the proposal is mostly finished and now it just needs feedback from implementors and users to progress further. In order to progress to Stage 3, the spec should be finished and at least two spec compliant implementations must be created.

The last stage is Stage 4. At this point, the proposal is ready to be included in the official specification. To get to Stage 4, tests have to be written, two spec compliant implementations should pass those tests, members should have significant practical experience with the new feature, and the EcmaScript spec editor must sign off on the spec text. Basically once a proposal makes it to stage 4, it’s ready to stop being a proposal and make its way into the official specification. This brings up the last thing you need to know about this whole process and that is TC39s release schedule.

As of 2016, a new version of ECMAScript is released every year with whatever features are ready at that time. What that means is that any Stage 4 proposals that exist when a new release happens, will be included in the release for that year. Because of this yearly release cycle, new features should be much more incremental and easier to adopt.

JavaScript is used today to develop web applications and mobile applications. It is also used to create interactive websites and to add animation and other features to enhance the user experience. JavaScript is also used to create web, mobile, and server applications that can run on a server, as well as client-side applications that run in the user’s browser.

Although JavaScript generally operates synchronously, the language allows us to easily write code that will allow multiple tasks to run at the same time. This allows a website to be more interactive, because multiple things can be happening “under the hood” at once while the user is exploring content. For example, you can interact with a page while a large amount of data is being fetched from a server in the background, without interrupting your experience. JavaScript allows many processes to run at once, and you can control this behavior in your application by writing different types of functions.

For more about the history and basic features of JavaScript, visit the Wikipedia’s JavaScript page.

### Why JavaScript is so useful today

There are two main reasons why JavaScript became so popular in web development; its ability to render dynamic content, and its ability to perform asynchronous tasks.

### Static vs dynamic web content

One of the early benefits of JavaScript was its ability to handle dynamic content. In the early days of the web, all web pages were static, which means that the data displayed on the page was loaded by the browser ahead of time, and the page would need to be re-loaded for any updates to show up. Websites are dynamic when they are able to render new data without reloading the page, and this is the type of behavior that JavaScript was designed to do. For example, because of JavaScript, we are able to see new messages show up in a social media feed without having to refresh the page.

### Performing asynchronous tasks

In order for the user to have a smooth experience working with a dynamic website, it needs to be able to accomplish tasks asynchronously. Many programming languages operate synchronously, which means that one operation needs to be completed before the next operation will begin.

### How to get started in learning JS

The best way to learn JS is to start writing JS.

To do that, you need to know how the language works, and that's what we'll focus on here. Even if you've programmed in other languages before, take your time getting comfortable with JS, and make sure to practice each piece.
