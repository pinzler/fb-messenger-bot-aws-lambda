# Build a simple FB Messenger Bot with AWS Lambda

This tutorial assumes that you have at least some experience with AWS.  You don't need to be an expert (I'm certainly not) but this maybe shouldn't be the very first thing you do with AWS.

### Part 1 - Facebook Page and App

Facebook [Messenger Bots](https://developers.facebook.com/docs/messenger-platform/) need to be tied to a Facebook Page so if you don't have an existing page (or just want to create a test bot first on a new page) you can create a new one [here](https://www.facebook.com/pages/create).

Next you will need to create a new [Facebook app](https://developers.facebook.com/apps).  Once you have created that app go to the "+ Add Product" area. Find Messenger click on the "Get Started".

Scroll down to "Token Generation" and select the page you just created.  Save that Page Access Token and keep this web page open because we will be coming back to it later to setup the webhooks.

### Part 2 - AWS Lambda

We need to create an AWS Lambda function. Go to [AWS console](http://aws.amazon.com) then Lambda then Create a Lambda Function (or the "Get Started" button if you have never created a Lambda function before.)

On the "Select a blueprint" page we can use either the Blank Function or hello-world blueprint, which is just a simple node.js function.

Now we setup your Lambda function where the first step is to configure triggers:

Click on the grey dotted line box that will present a pull down menu and select "API Gateway".

API Gateway options:
* API Name: Name of your API endpoint, leave as "LambdaMicroservice"
* Deployment stage: the name of your deployment stage, leave as "prod"
* Security: Change to "Open"

Next — configure your function:

* Name: a name of your function, for example "DemoBOT"
* Description: leave as is or put in a description if you want
* Runtime: make sure this is Node.js 4.3
* Lambda function code: copy in the index.js code with the PAGE_TOKEN equal to the Page Access Token you got from FB and also change the VERIFY_TOKEN to whatever you want.
* Handler: leave as is
* Role: Choose and exiting role and select lambda_basic_execution
* Memory(MIB): leave as is (128)
* Timeout: to be safe I like to make this 1 minute, 0 seconds
* VPC: No VPC

Then click on Next button, review your settings on and click on Create function. 

Now we need to create API endpoints for this function. Your function will receive messages from Facebook Messenger via this API endpoint.  Under the "Triggers" tab you should see your API Gateway.  Copy the gateway URL (we will need it later) and then click on the "Deployment stage: prod" link.

### Part 3 - AWS API Gateway

Click on your what you named your API Gateway. (If you left it as the default it should be LambdaMicroservice.) Under "Resources" you should see your Lambda function's name with an "ANY" under it.  Make sure to add the GET and POST to that part of the endpoint and not someplace else.

First, Facebook Messenger will need a GET API endpoint to verify your webhook. To add a GET method just click on Actions button, select the Create Method option, choose GET method, connect our Lambda function and save it.

You should now see a "GET - Method Execution" page.  Click on the "Integration Request" box and expand the "Body Mapping Templates" section. Add new mapping template with value "application/json", and in Generate template pull down menu choose the "Method Request" passthrough value and click on Save button.

Next, we need to add POST method. Again click on Actions button, select the Create Method option, choose POST method, connect our Lambda function and save it.

Lastly, we need to deploy our API gateway. To do that just click on Actions button and select the Deploy API option, then choose your Deployment stage and click Deploy API.

### Part 4 - Back to Facebook

Time to go back to the Facebook App setup page.

Now we need click on the "Setup Webhook" button and set the following fields:
* Callback URL: you need to copy your API gateway URL from your Lambda function Triggers tab
* Verify token: make sure you put in the value that is the same as what is in the index.js file for VERIFY_TOKEN
* Subscription fields: You can pick what you want for your bot but messages, messaging_postbacks, messaging_optins, message_deliveries should cover what we need for this simple example

Once your webhook is verified, scroll down and select the Facebook page to subscribe your webhook to the page events.

That's it!  Go to your facebook page, click on Message button and send something to it.  If everything worked the bot should echo the text back to you.

The index.js file has some extra functions that should help you start to build out your bot more.
