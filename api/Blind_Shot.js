export default function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';
  const isRobloxOrDelta = userAgent.includes('Roblox') || !userAgent.includes('Mozilla'); // Fallback untuk Delta

  if (isRobloxOrDelta) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(`local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local Workspace = game:GetService("Workspace")

local localPlayer = Players.LocalPlayer

local skinModels = {}
local lasers = {}
local activeBillboards = {} 
local bombParts = {} -- Tabel khusus untuk menyimpan referensi part Bomb

local LASER_COLOR = Color3.fromRGB(255, 0, 0)
local LASER_WIDTH_SCALE = 1/12.5
local LASER_HEIGHT_OFFSET = 0.5
local LASER_SHORTEN = 0.50

-- === FUNGSI TRACKING BOMB & SKIN ===
local function trackObject(obj)
	-- Tracking Bomb Part
	if obj:IsA("BasePart") and obj.Name:lower() == "bomb" then
		bombParts[obj] = true
	end

	-- Tracking Skin Models
	if not skinModels[obj] then
		if obj:IsA("Model") and obj.Name:lower():sub(1,5) == "skin_" then
			skinModels[obj] = true
			local laser = Instance.new("Part")
			laser.Anchored = true
			laser.CanCollide = false
			laser.Material = Enum.Material.Neon
			laser.Color = LASER_COLOR
			laser.Transparency = 0
			laser.Name = "SkinLaser"
			laser.Parent = Workspace
			lasers[obj] = laser
		end
	end
end

-- === FUNGSI ORDEMBILLBOARD (REAL-TIME) ===
local function registerBillboard(billboard, head)
	if not billboard or not head then return end
	if activeBillboards[billboard] then return end

	activeBillboards[billboard] = head  
	billboard.AlwaysOnTop = true  
	billboard.Enabled = true
	
	for _, obj in pairs(billboard:GetDescendants()) do  
		if obj:IsA("GuiObject") then obj.Visible = true end  
	end
end

-- === FUNGSI HITBOX & CHARACTER ===
local function isHitbox(part)
	local n = part.Name:lower()
	if n:find("hitbox") or n == "hb" then return true end
	if part.Size.Magnitude > 10 then return true end
	return false
end

local function fixCharacter(character)
	for _, obj in ipairs(character:GetDescendants()) do
		if obj:IsA("BasePart") then
			if obj.Name ~= "HumanoidRootPart" then
				if isHitbox(obj) then
					obj.Transparency = 1
					obj.LocalTransparencyModifier = 1
					obj.CanCollide = false
				else
					obj.Transparency = 0
					obj.LocalTransparencyModifier = 0
				end
			end
		elseif obj:IsA("Decal") then
			obj.Transparency = 0
		end
	end
end

local function setupCharacter(character)
	if not character then return end
	local function checkHead(child)
		if child.Name == "Head" then
			local bb = child:FindFirstChild("OrdemBillboard")
			if bb then registerBillboard(bb, child) end
			child.ChildAdded:Connect(function(g)
				if g.Name == "OrdemBillboard" then registerBillboard(g, child) end
			end)
		end
	end
	local head = character:FindFirstChild("Head")
	if head then checkHead(head) else character.ChildAdded:Connect(checkHead) end
end

-- === INITIALIZATION ===
for _, obj in ipairs(Workspace:GetDescendants()) do
	trackObject(obj)
end

Workspace.DescendantAdded:Connect(trackObject)

for _, player in pairs(Players:GetPlayers()) do
	if player.Character then setupCharacter(player.Character) end
	player.CharacterAdded:Connect(setupCharacter)
end

Players.PlayerAdded:Connect(function(player)
	player.CharacterAdded:Connect(setupCharacter)
end)

local function getBoundingBox(model)
	local cframe, size
	pcall(function() cframe, size = model:GetBoundingBox() end)
	return cframe, size
end

-- === RENDERSTEPPED LOOP ===
RunService.RenderStepped:Connect(function()
	-- 1. Update OrdemBillboard
	for billboard, head in pairs(activeBillboards) do
		if billboard.Parent and head.Parent then
			billboard.Enabled = true
			billboard.Adornee = head
		else
			activeBillboards[billboard] = nil
		end
	end

	-- 2. Update Hitbox & Visibility Player
	for _, player in ipairs(Players:GetPlayers()) do
		if player ~= localPlayer and player.Character then
			fixCharacter(player.Character)
		end
	end

	-- 3. Update Bomb Parts (New)
	for bomb, _ in pairs(bombParts) do
		if bomb.Parent then
			bomb.Transparency = 0
			bomb.CanCollide = false -- Agar tidak menghalangi jalan
		else
			bombParts[bomb] = nil
		end
	end

	-- 4. Update Skin Lasers
	for model, _ in pairs(skinModels) do
		if model.Parent then
			for _, part in ipairs(model:GetDescendants()) do
				if part:IsA("BasePart") then
					part.Transparency = 0
					part.CanCollide = false
					if part.Material == Enum.Material.ForceField then
						part.Material = Enum.Material.SmoothPlastic
					end
				end
			end

			local laser = lasers[model]
			if laser then
				local cframe, size = getBoundingBox(model)
				if cframe and size then
					local laserSize = Vector3.new(size.X * LASER_WIDTH_SCALE, size.Y * LASER_WIDTH_SCALE, size.Z - LASER_SHORTEN*2)
					laser.Size = laserSize
					local front = cframe.Position + (cframe.LookVector * (size.Z/2 - LASER_SHORTEN))
					local back = cframe.Position - (cframe.LookVector * (size.Z/2 - LASER_SHORTEN))
					local centerLine = (front + back) / 2 + Vector3.new(0, LASER_HEIGHT_OFFSET, 0)
					laser.CFrame = CFrame.new(centerLine, centerLine + cframe.LookVector)
				end
			end
		else
			if lasers[model] then lasers[model]:Destroy(); lasers[model] = nil end
			skinModels[model] = nil
		end
	end
end)
`);
  } else {
    res.status(403).setHeader('Content-Type', 'text/plain').send('Secured By ZiFiID');
  }
}
