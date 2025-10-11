export default function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';
  const isRobloxOrDelta = userAgent.includes('Roblox') || !userAgent.includes('Mozilla'); // Fallback untuk Delta

  if (isRobloxOrDelta) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(`-- Build A Plane GodMode Script Made By ZiFiID
if game.PlaceId ~= 137925884276740 then
	return -- Stop the script if not in Build A Plane
end

local Players = game:GetService("Players")
local TweenService = game:GetService("TweenService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local UserInputService = game:GetService("UserInputService")
local Workspace = game:GetService("Workspace")

local player = Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")

local screenGui = Instance.new("ScreenGui")
screenGui.Name = "InvincibleToggleUI"
screenGui.ResetOnSpawn = false
screenGui.IgnoreGuiInset = true
screenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
screenGui.Parent = playerGui

local frame = Instance.new("Frame")
frame.Size = UDim2.new(0, 120, 0, 75)
frame.Position = UDim2.new(1, -130, 0, 20)
frame.BackgroundColor3 = Color3.fromRGB(35, 35, 35)
frame.Active = true
frame.Draggable = false
frame.Parent = screenGui

local corner = Instance.new("UICorner")
corner.CornerRadius = UDim.new(0, 10)
corner.Parent = frame

local label = Instance.new("TextLabel")
label.Size = UDim2.new(1, 0, 0, 40)
label.BackgroundTransparency = 1
label.Text = "OFF"
label.TextColor3 = Color3.fromRGB(255, 255, 255)
label.TextScaled = true
label.Font = Enum.Font.GothamBold
label.Parent = frame

local stroke = Instance.new("UIStroke")
stroke.Thickness = 2
stroke.Color = Color3.fromRGB(0, 255, 0)
stroke.Transparency = 0.7
stroke.Parent = frame

local resetButton = Instance.new("TextButton")
resetButton.Size = UDim2.new(1, -10, 0, 30)
resetButton.Position = UDim2.new(0, 5, 0, 42)
resetButton.BackgroundColor3 = Color3.fromRGB(50, 50, 50)
resetButton.Text = "RESET"
resetButton.TextColor3 = Color3.fromRGB(255, 255, 255)
resetButton.TextScaled = true
resetButton.Font = Enum.Font.GothamBold
resetButton.AutoButtonColor = false
resetButton.Parent = frame

local resetCorner = Instance.new("UICorner")
resetCorner.CornerRadius = UDim.new(0, 8)
resetCorner.Parent = resetButton

local resetStroke = Instance.new("UIStroke")
resetStroke.Thickness = 2
resetStroke.Color = Color3.fromRGB(255, 255, 0)
resetStroke.Transparency = 0.5
resetStroke.Parent = resetButton

local isInvincible = false
local oldNamecall
local dragStart, startPos
local dragStarted = false
local clickStartTime

local function tween(obj, props, dur, style)
	local info = TweenInfo.new(dur or 0.25, style or Enum.EasingStyle.Sine, Enum.EasingDirection.InOut)
	local t = TweenService:Create(obj, info, props)
	t:Play()
	return t
end

local function endsWithGround(name)
	return string.lower(string.sub(name, -6)) == "ground"
end

local groundConnections = {}

local function makeHarmless(part)
	if part:IsA("BasePart") then
		part.CanTouch = false
	end
end

local function restoreGrounds()
	for _, obj in ipairs(Workspace:GetDescendants()) do
		if obj:IsA("BasePart") and endsWithGround(obj.Name) then
			obj.CanTouch = true
		end
	end
	for _, conn in ipairs(groundConnections) do
		conn:Disconnect()
	end
	table.clear(groundConnections)
end

local function protectAllGrounds()
	for _, obj in ipairs(Workspace:GetDescendants()) do
		if obj:IsA("BasePart") and endsWithGround(obj.Name) then
			makeHarmless(obj)
		end
	end
	table.insert(groundConnections, Workspace.DescendantAdded:Connect(function(obj)
		if obj:IsA("BasePart") and endsWithGround(obj.Name) then
			makeHarmless(obj)
		end
	end))
end

local function blockRemotes()
	local success, launchEvents = pcall(function()
		return ReplicatedStorage:WaitForChild("Remotes", 5):WaitForChild("LaunchEvents", 5)
	end)
	if not success or not launchEvents then return end
	local returnRemote = launchEvents:FindFirstChild("Return")
	local blockBroken = launchEvents:FindFirstChild("BlockBroken")
	if not (returnRemote and blockBroken) then return end

	if isInvincible then
		if not oldNamecall then
			oldNamecall = hookmetamethod(game, "__namecall", function(self, ...)
				if (self == returnRemote or self == blockBroken) and getnamecallmethod() == "FireServer" then
					return
				end
				return oldNamecall(self, ...)
			end)
		end
	else
		if oldNamecall then
			hookmetamethod(game, "__namecall", oldNamecall)
			oldNamecall = nil
		end
	end
end

local function updateToggle(animated)
	if isInvincible then
		label.Text = "ON"
		if animated then
			tween(frame, {BackgroundColor3 = Color3.fromRGB(0, 170, 0)}, 0.25)
			tween(frame, {Size = UDim2.new(0, 125, 0, 80)}, 0.15, Enum.EasingStyle.Back)
			task.wait(0.15)
			tween(frame, {Size = UDim2.new(0, 120, 0, 75)}, 0.15, Enum.EasingStyle.Back)
		else
			frame.BackgroundColor3 = Color3.fromRGB(0, 170, 0)
		end
	else
		label.Text = "OFF"
		if animated then
			tween(frame, {BackgroundColor3 = Color3.fromRGB(35, 35, 35)}, 0.25)
			tween(frame, {Size = UDim2.new(0, 125, 0, 80)}, 0.15, Enum.EasingStyle.Back)
			task.wait(0.15)
			tween(frame, {Size = UDim2.new(0, 120, 0, 75)}, 0.15, Enum.EasingStyle.Back)
		else
			frame.BackgroundColor3 = Color3.fromRGB(35, 35, 35)
		end
	end
end

local function toggleInvincible()
	isInvincible = not isInvincible
	updateToggle(true)
	blockRemotes()
	if isInvincible then
		protectAllGrounds()
	else
		restoreGrounds()
	end
end

frame.InputBegan:Connect(function(input)
	if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
		clickStartTime = tick()
		dragStarted = false
		dragStart = input.Position
		startPos = frame.Position
	end
end)

UserInputService.InputChanged:Connect(function(input)
	if input.UserInputType == Enum.UserInputType.MouseMovement or input.UserInputType == Enum.UserInputType.Touch then
		if dragStart then
			local delta = input.Position - dragStart
			if math.abs(delta.X) > 5 or math.abs(delta.Y) > 5 then
				dragStarted = true
				frame.Position = UDim2.new(startPos.X.Scale, startPos.X.Offset + delta.X, startPos.Y.Scale, startPos.Y.Offset + delta.Y)
			end
		end
	end
end)

frame.InputEnded:Connect(function(input)
	if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
		if not dragStarted and tick() - clickStartTime < 0.3 then
			toggleInvincible()
		end
		dragStart = nil
		dragStarted = false
	end
end)

resetButton.InputBegan:Connect(function(input)
	if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
		dragStart = input.Position
		startPos = frame.Position
	end
end)

resetButton.InputEnded:Connect(function(input)
	if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
		local success, launchEvents = pcall(function()
			return ReplicatedStorage:WaitForChild("Remotes", 5):WaitForChild("LaunchEvents", 5)
		end)
		if success and launchEvents then
			local returnRemote = launchEvents:FindFirstChild("Return")
			if returnRemote then
				local prev = isInvincible
				if prev then
					isInvincible = false
					blockRemotes()
				end
				tween(resetButton, {BackgroundColor3 = Color3.fromRGB(255, 255, 0)}, 0.15)
				returnRemote:FireServer()
				task.wait(0.15)
				tween(resetButton, {BackgroundColor3 = Color3.fromRGB(50, 50, 50)}, 0.15)
				isInvincible = prev
				blockRemotes()
				if prev then protectAllGrounds() end
			end
		end
	end
end)

frame.BackgroundTransparency = 1
label.TextTransparency = 1
resetButton.BackgroundTransparency = 1
resetButton.TextTransparency = 1
tween(frame, {BackgroundTransparency = 0}, 0.4)
tween(label, {TextTransparency = 0}, 0.4)
tween(resetButton, {BackgroundTransparency = 0}, 0.5)
tween(resetButton, {TextTransparency = 0}, 0.5)
updateToggle(false)`);
  } else {
    res.status(403).setHeader('Content-Type', 'text/plain').send('Contents cannot be displayed in browser');
  }
}
