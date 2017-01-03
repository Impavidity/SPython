def add(a,b):
	e = 10
	def add1(d):
		def add2(d):
			f = a + b + d + e + 3
			return f
		return add2
	return add1
a = 1
b = 2
c = add(a,b=5)(4)
d = add(4,6)(5)
print c
