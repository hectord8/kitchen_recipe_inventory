"use client"

export default function login() {
  return (
    <div >
      <main >
            <h2>Login</h2>
            <form>
                <label >First name:</label>
                    <input
                    type="text"
                    value={"name"}
                    onChange={(e) => setName(e.target.value)}
                    />

                 <label >Password:</label>
                    <input
                    type="text"
                    value={"password"}
                    onChange={(e) => setName(e.target.value)}
                    />

                <button>Submit</button>
            </form>
      </main>
    </div>
  );
}
