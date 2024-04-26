local handle = io.open(arg[1], "r")
if not handle then return end

local source = handle:read("*all")
handle:close()

local status, message = load(source)
if not status then
  print("Parse Error\n" .. message)
  os.exit(1)
end

os.exit(0)
