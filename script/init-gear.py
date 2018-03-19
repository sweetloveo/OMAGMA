from firebase import Firebase

gearmotors = Firebase('https://omagma-abe44.firebaseio.com/gearmotors')
company = Firebase('https://omagma-abe44.firebaseio.com/company/-KuF0fUrIA230vrCWjh-/group/-KuF0heryzvh_rBA9DTn/gearmotors')

gearmotors_data = gearmotors.get()
for gearmotor_key in gearmotors_data:
	# gearmotor_key
	company.push({ 'id': gearmotor_key })