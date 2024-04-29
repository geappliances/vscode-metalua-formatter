local status, message = loadfile(arg[1])
if not status then
  print("Parse Error\n" .. message)
  os.exit(1)
end

os.exit(0)
