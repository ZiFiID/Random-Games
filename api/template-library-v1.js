export default function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';
  const isRobloxOrDelta = userAgent.includes('Roblox') || !userAgent.includes('Mozilla'); // Fallback untuk Delta

  if (isRobloxOrDelta) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(`--[=[
 d888b  db    db d888888b      .d888b.      db      db    db  .d8b.  
88' Y8b 88    88   `88'        VP  `8D      88      88    88 d8' `8b 
88      88    88    88            odD'      88      88    88 88ooo88 
88  ooo 88    88    88          .88'        88      88    88 88~~~88 
88. ~8~ 88b  d88   .88.        j88.         88booo. 88b  d88 88   88    @uniquadev
 Y888P  ~Y8888P' Y888888P      888888D      Y88888P ~Y8888P' YP   YP  UI LIBRARY

A modular Roblox UI library with cartoony animations for Delta Executor.
]=]

local CollectionService = game:GetService("CollectionService")
local Players = game:GetService("Players")
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")

-- Module definition
local UILibrary = {}
UILibrary.__index = UILibrary

-- Default configuration
local DefaultConfig = {
    WindowSize = UDim2.new(0, 400, 0, 300), -- Smaller for mobile
    WindowPosition = UDim2.new(0.5, -200, 0.5, -150), -- Centered
    BackgroundTransparency = 0.3,
    Title = "Template",
    TitleFont = Font.new("rbxasset://fonts/families/PressStart2P.json", Enum.FontWeight.Regular, Enum.FontStyle.Normal),
    TitleSize = 32, -- Smaller for mobile
    CloseButtonColor = Color3.fromRGB(255, 0, 0),
    CloseButtonText = "X",
    FrameTransparency = 0.6,
    AnimationDuration = 0.4, -- Fast for cartoony feel
}

-- Helper function to create a gradient
local function createGradient(parent, colorSequence)
    local gradient = Instance.new("UIGradient")
    gradient.Color = colorSequence
    gradient.Parent = parent
    return gradient
end

-- Create a new UI window
function UILibrary.new(config)
    config = config or {}
    local self = setmetatable({}, UILibrary)

    -- Merge default config with user config
    for key, value in pairs(DefaultConfig) do
        if config[key] == nil then
            config[key] = value
        end
    end

    -- Create ScreenGui
    self.ScreenGui = Instance.new("ScreenGui")
    self.ScreenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
    self.ScreenGui.Name = config.Title or "UILibraryGui"
    self.ScreenGui.Parent = Players.LocalPlayer:WaitForChild("PlayerGui")
    CollectionService:AddTag(self.ScreenGui, "main")

    -- Create main Frame
    self.Frame = Instance.new("Frame")
    self.Frame.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
    self.Frame.Size = config.WindowSize
    self.Frame.Position = UDim2.new(0.5, -200, -1, 0) -- Start above screen
    self.Frame.BackgroundTransparency = config.BackgroundTransparency
    self.Frame.Parent = self.ScreenGui
    self.Frame.AnchorPoint = Vector2.new(0.5, 0.5) -- Center for scaling

    -- Add UICorner
    Instance.new("UICorner").Parent = self.Frame

    -- Add gradient
    createGradient(self.Frame, ColorSequence.new{
        ColorSequenceKeypoint.new(0, Color3.fromRGB(25, 25, 25)),
        ColorSequenceKeypoint.new(1, Color3.fromRGB(255, 255, 255))
    })

    -- Add dragging functionality for mobile
    local dragging, dragStart, startPos
    self.Frame.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.Touch then
            dragging = true
            dragStart = input.Position
            startPos = self.Frame.Position
        end
    end)
    self.Frame.InputChanged:Connect(function(input)
        if dragging and input.UserInputType == Enum.UserInputType.Touch then
            local delta = input.Position - dragStart
            self.Frame.Position = UDim2.new(
                startPos.X.Scale,
                startPos.X.Offset + delta.X,
                startPos.Y.Scale,
                startPos.Y.Offset + delta.Y
            )
        end
    end)
    self.Frame.InputEnded:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.Touch then
            dragging = false
        end
    end)

    -- Create title bar
    self.TitleBar = Instance.new("Frame")
    self.TitleBar.BackgroundColor3 = Color3.fromRGB(0, 0, 0)
    self.TitleBar.Size = UDim2.new(0, config.WindowSize.X.Offset, 0, 48)
    self.TitleBar.BackgroundTransparency = 0.5
    self.TitleBar.Parent = self.Frame
    Instance.new("UICorner").Parent = self.TitleBar

    -- Create title label
    self.TitleLabel = Instance.new("TextLabel")
    self.TitleLabel.Text = config.Title
    self.TitleLabel.TextSize = config.TitleSize
    self.TitleLabel.FontFace = config.TitleFont
    self.TitleLabel.BackgroundTransparency = 1
    self.TitleLabel.TextStrokeTransparency = 0.6
    self.TitleLabel.Size = UDim2.new(0, config.WindowSize.X.Offset - 60, 0, 52)
    self.TitleLabel.Position = UDim2.new(0, 0, 0, -2)
    self.TitleLabel.Parent = self.Frame
    createGradient(self.TitleLabel, ColorSequence.new{
        ColorSequenceKeypoint.new(0, Color3.fromRGB(0, 0, 0)),
        ColorSequenceKeypoint.new(1, Color3.fromRGB(255, 255, 255))
    })

    -- Create close button
    self.CloseButton = Instance.new("TextButton")
    self.CloseButton.Text = config.CloseButtonText
    self.CloseButton.TextSize = 24
    self.CloseButton.FontFace = Font.new("rbxasset://fonts/families/GothamSSm.json", Enum.FontWeight.Bold, Enum.FontStyle.Normal)
    self.CloseButton.BackgroundColor3 = config.CloseButtonColor
    self.CloseButton.Size = UDim2.new(0, 38, 0, 34)
    self.CloseButton.Position = UDim2.new(0, config.WindowSize.X.Offset - 48, 0, 6)
    self.CloseButton.Parent = self.Frame
    Instance.new("UICorner").Parent = self.CloseButton
    createGradient(self.CloseButton, ColorSequence.new{
        ColorSequenceKeypoint.new(0, Color3.fromRGB(202, 0, 0)),
        ColorSequenceKeypoint.new(0.175, Color3.fromRGB(202, 0, 0)),
        ColorSequenceKeypoint.new(1, Color3.fromRGB(0, 0, 0))
    })

    -- Create content frames
    self.LeftFrame = Instance.new("Frame")
    self.LeftFrame.Name = "Frame2"
    self.LeftFrame.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
    self.LeftFrame.Size = UDim2.new(0, 190, 0, 220)
    self.LeftFrame.Position = UDim2.new(0, 10, 0, 68)
    self.LeftFrame.BackgroundTransparency = config.FrameTransparency
    self.LeftFrame.Parent = self.Frame
    Instance.new("UICorner").Parent = self.LeftFrame
    createGradient(self.LeftFrame, ColorSequence.new{
        ColorSequenceKeypoint.new(0, Color3.fromRGB(0, 0, 0)),
        ColorSequenceKeypoint.new(0.204, Color3.fromRGB(0, 0, 0)),
        ColorSequenceKeypoint.new(1, Color3.fromRGB(255, 255, 255))
    })

    self.RightFrame = Instance.new("Frame")
    self.RightFrame.Name = "Frame3"
    self.RightFrame.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
    self.RightFrame.Size = UDim2.new(0, 190, 0, 220)
    self.RightFrame.Position = UDim2.new(0, 200, 0, 68)
    self.RightFrame.BackgroundTransparency = config.FrameTransparency
    self.RightFrame.Parent = self.Frame
    Instance.new("UICorner").Parent = self.RightFrame
    createGradient(self.RightFrame, ColorSequence.new{
        ColorSequenceKeypoint.new(0, Color3.fromRGB(0, 0, 0)),
        ColorSequenceKeypoint.new(1, Color3.fromRGB(255, 255, 255))
    })

    -- Play cartoony animation
    self:PlayCartoonyAnimation(config)

    -- Event connections
    self.CloseButton.MouseButton1Click:Connect(function()
        self:DestroyWithAnimation()
    end)

    return self
end

-- Cartoony animation sequence
function UILibrary:PlayCartoonyAnimation(config)
    local frame = self.Frame
    local duration = config.AnimationDuration
    local easingStyle = Enum.EasingStyle.Bounce
    local easingDirection = Enum.EasingDirection.Out

    local tweenInfo = TweenInfo.new(duration, easingStyle, easingDirection)

    local fallDown = TweenService:Create(frame, tweenInfo, {
        Position = UDim2.new(0.5, -200, 0.7, 0), -- Overshoot downward
        Size = UDim2.new(0, config.WindowSize.X.Offset * 0.9, 0, config.WindowSize.Y.Offset * 0.8) -- Squash
    })

    local bounceUp = TweenService:Create(frame, tweenInfo, {
        Position = UDim2.new(0.5, -200, 0.3, 0), -- Bounce up
        Size = UDim2.new(0, config.WindowSize.X.Offset * 0.8, 0, config.WindowSize.Y.Offset * 1.1) -- Stretch
    })

    local settle = TweenService:Create(frame, tweenInfo, {
        Position = config.WindowPosition,
        Size = config.WindowSize
    })

    -- Add sound effect for cartoony feel
    local sound = Instance.new("Sound")
    sound.SoundId = "rbxasset://sounds/uuhhh.mp3" -- Roblox boing sound
    sound.Parent = self.Frame
    sound:Play()

    fallDown:Play()
    fallDown.Completed:Connect(function()
        sound:Play()
        bounceUp:Play()
    end)
    bounceUp.Completed:Connect(function()
        sound:Play()
        settle:Play()
    end)
end

-- Destroy with animation
function UILibrary:DestroyWithAnimation()
    local frame = self.Frame
    local tweenInfo = TweenInfo.new(0.3, Enum.EasingStyle.Back, Enum.EasingDirection.In)
    local tween = TweenService:Create(frame, tweenInfo, {
        Position = UDim2.new(0.5, -200, -1, 0), -- Exit upward
        Size = UDim2.new(0, self.Frame.Size.X.Offset * 0.5, 0, self.Frame.Size.Y.Offset * 0.5) -- Shrink
    })
    local sound = Instance.new("Sound")
    sound.SoundId = "rbxasset://sounds/uuhhh.mp3"
    sound.Parent = self.Frame
    sound:Play()
    tween:Play()
    tween.Completed:Connect(function()
        self:Destroy()
    end)
end

-- Method to destroy the UI
function UILibrary:Destroy()
    if self.ScreenGui then
        self.ScreenGui:Destroy()
    end
end

-- Method to add custom content to LeftFrame
function UILibrary:AddToLeftFrame(element)
    element.Parent = self.LeftFrame
end

-- Method to add custom content to RightFrame
function UILibrary:AddToRightFrame(element)
    element.Parent = self.RightFrame
end

-- Method to set title
function UILibrary:SetTitle(title)
    self.TitleLabel.Text = title
end

-- Method to set window size
function UILibrary:SetSize(size)
    self.Frame.Size = size
    self.TitleBar.Size = UDim2.new(0, size.X.Offset, 0, 48)
    self.TitleLabel.Size = UDim2.new(0, size.X.Offset - 60, 0, 52)
    self.CloseButton.Position = UDim2.new(0, size.X.Offset - 48, 0, 6)
end

-- Return the module for testing
return UILibrary`);
  } else {
    res.status(403).setHeader('Content-Type', 'text/plain').send('Contents cannot be displayed in browser');
  }
}
