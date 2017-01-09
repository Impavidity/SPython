def fi(a):
	if a == 0:
		return 1
	if a == 1:
		return 1
	return fi(a-1) + fi(a-2)

e = fi(10)
print e
