# Chapter 1: Introduction

::: info What is Cryptography
**Cryptography**, or **cryptology**, is the practice and study of techniques for secure communication in the presence of adversarial behavior. More generally, cryptography is about constructing and analyzing protocols that prevent third parties or the public from reading private messages. —— Wikipedia

密码学，或称密码学，是在对抗行为存在的情况下，进行安全通信技术的实践和研究. 更广泛地说，密码学是构建和分析防止第三方或公众阅读私有消息的协议. 
:::

密码学分为两大类：**经典密码学**和**现代密码学**. 经典密码学更像是一种启发式（Heuristic）的艺术，设计者依靠直觉构建复杂的算法，如果没被破解，就认为它是安全的. 书中以凯撒密码和 Vigenère 密码为例，展示了经典密码学的特点和局限性. 

<!-- TODO: 添加有关维吉尼亚密码的例题和展示，后续添加自定义 vue 模块 -->

经典密码学实际上基本等同于加密(encryption)，也就是将明文(plaintext)转换为密文(ciphertext)的过程，密文通过解密(decryption)还原为明文才能被阅读，这需要借助一个秘密代码用于转换明文和密文，也就是所谓的密钥(key). 现代密码学将这一过程标准化为“私钥加密”(private-key encryption)：两方需要沟通信息 $m$，但是存在窃听者(eavesdropper)，可以监听双方的通信，为了避免明文泄露，双方事先共享一个密钥 $k$，发送方使用 $k$ 将 $m$ 加密成密文 $c$，接收方使用 $k$ 将 $c$ 解密成 $m$. 这一加密方案(encryption scheme)的特点是使用同一个密钥进行加密和解密，因此又称为对称加密(symmetric encryption). 为了后续的形式化，我们用如下的元组来定义一个私钥加密方案：

::: thm Definition: Private-Key Encryption Scheme
形式化地，我们用元组 $(\text{Gen}, \text{Enc}, \text{Dec})$ 来表示一个消息空间为 $\mathcal{M}$ 的私钥加密方案（密钥生成算法 $\text{Gen}$、加密算法 $\text{Enc}$ 和解密算法 $\text{Dec}$）. 消息空间 $\mathcal{M}$ 定义了“合法”消息（即方案所支持的消息）的集合，而其余的算法具有以下功能：

- $\text{Gen}$：输出一个按某种分布选择的密钥 $k$ 的概率算法，我们设所有密钥的集合为 $\mathcal{K}$. 一般来说，$\text{Gen}$ 几乎总是随机地从 $\mathcal{K}$ 中选择一个密钥 $k$，因此我们可以记为 $k \leftarrow \text{Gen}$.
- $\text{Enc}$：输入一个密钥 $k$ 和一个消息 $m \in \mathcal{M}$，输出一个密文 $c$ 的概率算法，记为 $c \leftarrow \text{Enc}_k(m)$.
- $\text{Dec}$：输入一个密钥 $k$ 和一个密文 $c$，输出一个消息 $m$ 的算法，记为 $m := \text{Dec}_k(c)$.

> 这里 $\text{Enc}$ 和 $\text{Dec}$ 分别使用了 $\leftarrow$ 和 $:=$，表示前者是概率算法，意味着它可能使用随机化来生成不同的密文，即使输入相同的消息和密钥，而后者为确定性算法，给定相同的输入总是产生相同的输出. 这也符合我们的直觉：加密过程可能涉及随机化以增强安全性，而解密过程应该是确定性的，相同的密文和密钥应该输出相同的明文，以确保正确还原消息.

一个加密方案必须满足如下正确性要求：对 $\forall\, m \in \mathcal{M}$，$\forall\, k \in \mathcal{K}$，有 $\text{Dec}_k(\text{Enc}_k(m)) = m$ 成立. 

这里对私钥加密方案定义的叙述较为宽泛，更严谨的叙述在第三章中会提及.
:::

现代密码学除了对称加密以外，还有**公钥加密(public-key encryption)**、**数字签名(digital signature)**、**零知识证明(zero-knowledge proof)** 等重要的分支，相比于经典密码学，现代密码学已经发展成为一个严谨的科学领域. 不过要介绍现代密码学，我们需要从现代密码学的三大原则说起：

::: thm Definitions: Three Principles of Modern Cryptography

现代密码学的三大原则是：

1. **形式化定义(Formal Definitions)**：通过描述加密方案的<strong>安全保证(safe guarantee)</strong>与<strong>威胁模型(threat model)</strong>给出安全的定义. 安全保证定义了方案旨在防止攻击者做什么，或者说对于攻击者而言什么构成了成功的攻击；而威胁模型定义了攻击者能够实施哪些攻击行为（但并不假设攻击者的攻击策略）. 常见的威胁模型包括：

    - **唯密文攻击(ciphertext-only attack)**：最基本的攻击，攻击者通过监听只能得到密文，并试图从中确定明文的信息.
    - **已知明文攻击(known-plaintext attack)**：攻击者可以学习到一个或多个使用某个密钥生成的明文-密文对，并据此试图破解基于同一密钥加密的其他密文对应的明文.
    - **选择明文攻击(chosen-plaintext attack)**：类似于已知明文攻击，但攻击者可以选择任意明文并获得其对应的密文.
    - **选择密文攻击(chosen-ciphertext attack)**：攻击者可以选择任意密文并获得其对应的明文.

2. **精确假设(Precise Assumptions)**：安全性证明通常依赖于假设，而这种假设必须是明确的且数学上精确的，例如 RSA 依赖于大数分解在计算上困难性的假设. 现代密码学要求这些假设必须被明确地陈述，以便进行评估和比较.
3. **安全性证明(Proofs of Security)**：提供严格的证明，表明一个构造在特定假设下满足给定的定义. 这种证明一般是归约证明，即证明如果有人能破解该算法，那么就能利用这个破解方法来解决一个已知的困难问题（如大数分解），从而表明该算法的安全性与困难问题的难度相关，只要难题足够难，算法就足够安全.

:::

满足上述三大原则的方案被称为是”可证明安全“的，但是并不意味着它在现实中就一定安全. 可证明安全性是相对的，它的有效性完全取决于安全性声明、威胁模型和底层假设是否与现实匹配. 如果安全保证是不符合要求的，或者威胁模型没能正确预测攻击者的真实能力，以及所依赖的假设是错误的，都会导致方案在实际应用中失去安全性.